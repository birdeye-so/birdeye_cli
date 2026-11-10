import { z } from "zod";
import { AppError, object, type Data } from "./shared.js";

export const BIRDEYE_MCP_URL = "https://mcp.birdeye.so/mcp";
const versions = ["2025-06-18", "2025-03-26"];
const toolSchema = z
  .object({
    name: z.string().min(1).max(256),
    description: z.string().optional(),
    inputSchema: z.object({ type: z.literal("object") }).passthrough(),
    annotations: z
      .object({
        readOnlyHint: z.boolean().optional(),
        destructiveHint: z.boolean().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();
export type McpTool = z.infer<typeof toolSchema>;

/** A bounded, request/response Streamable HTTP client for the official server.
 * No background GET stream, arbitrary endpoints, OAuth flow or automatic call retries.
 */
export class BirdeyeMcp {
  private sequence = 0;
  private session?: string;
  private version = versions[0];
  private ready = false;
  private catalog?: McpTool[];
  constructor(
    private key = "",
    private options: { fetch?: typeof fetch; timeoutMs?: number } = {},
  ) {}

  private redact(value: Data): Data {
    if (!this.key) return value;
    const secret = JSON.stringify(this.key).slice(1, -1);
    return JSON.parse(JSON.stringify(value).split(secret).join("[REDACTED]"));
  }

  private async response(response: Response, id: number): Promise<Data> {
    const stream = response.headers
      .get("content-type")
      ?.includes("text/event-stream");
    if (
      !stream &&
      !response.headers.get("content-type")?.includes("application/json")
    ) {
      await response.body?.cancel();
      throw new AppError(
        "MCP_PROTOCOL_ERROR",
        "Birdeye MCP returned an unsupported content type.",
      );
    }
    const reader = response.body?.getReader();
    if (!reader)
      throw new AppError(
        "MCP_PROTOCOL_ERROR",
        "Birdeye MCP returned an empty response.",
      );
    let text = "",
      size = 0;
    const decoder = new TextDecoder();
    const match = (raw: string): Data | undefined => {
      const message = object(JSON.parse(raw));
      return message.jsonrpc === "2.0" && message.id === id
        ? message
        : undefined;
    };
    try {
      while (true) {
        const chunk = await reader.read();
        size += chunk.value?.byteLength || 0;
        if (size > 2_000_000)
          throw new AppError(
            "MCP_RESPONSE_TOO_LARGE",
            "Birdeye MCP response exceeded 2 MB.",
          );
        text += decoder.decode(chunk.value, { stream: !chunk.done });
        if (stream) {
          let boundary: RegExpExecArray | null;
          while ((boundary = /\r?\n\r?\n/.exec(text))) {
            const event = text.slice(0, boundary.index);
            text = text.slice(boundary.index + boundary[0].length);
            const data = event
              .split(/\r?\n/)
              .filter((line) => line.startsWith("data:"))
              .map((line) => line.slice(5).replace(/^ /, ""))
              .join("\n");
            if (data) {
              const message = match(data);
              if (message) return message;
            }
          }
        }
        if (chunk.done) break;
      }
      if (!stream) {
        const message = match(text);
        if (message) return message;
      }
      throw new AppError(
        "MCP_PROTOCOL_ERROR",
        "Birdeye MCP response did not match the request.",
      );
    } finally {
      await reader.cancel().catch(() => {});
    }
  }

  private async rpc(
    method: string,
    params: Data,
    signal?: AbortSignal,
    notification = false,
  ): Promise<Data> {
    signal?.throwIfAborted();
    const id = ++this.sequence;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    };
    if (this.key) headers["x-api-key"] = this.key;
    if (this.session) headers["Mcp-Session-Id"] = this.session;
    if (this.ready) headers["MCP-Protocol-Version"] = this.version;
    try {
      const response = await (this.options.fetch || fetch)(BIRDEYE_MCP_URL, {
        method: "POST",
        headers,
        redirect: "error",
        signal: AbortSignal.any([
          AbortSignal.timeout(this.options.timeoutMs ?? 20000),
          ...(signal ? [signal] : []),
        ]),
        body: JSON.stringify({
          jsonrpc: "2.0",
          ...(notification ? {} : { id }),
          method,
          params,
        }),
      });
      if (!response.ok) {
        await response.body?.cancel();
        if (response.status === 404) {
          this.ready = false;
          this.session = undefined;
          this.catalog = undefined;
        }
        throw new AppError(
          "MCP_HTTP_ERROR",
          `Birdeye MCP returned HTTP ${response.status}.`,
          response.status === 429 || response.status >= 500,
        );
      }
      if (notification) {
        await response.body?.cancel();
        return {};
      }
      const message = await this.response(response, id);
      if (message.error)
        throw new AppError(
          "MCP_RPC_ERROR",
          "Birdeye MCP rejected the request. Check the tool schema and API access.",
        );
      if (
        !message.result ||
        typeof message.result !== "object" ||
        Array.isArray(message.result)
      )
        throw new AppError(
          "MCP_PROTOCOL_ERROR",
          "Birdeye MCP returned an invalid result.",
        );
      if (method === "initialize")
        this.session = response.headers.get("Mcp-Session-Id") || undefined;
      return this.redact(message.result);
    } catch (error) {
      signal?.throwIfAborted();
      if (error instanceof AppError) throw error;
      throw new AppError(
        "MCP_CONNECTION_ERROR",
        "Birdeye MCP connection failed, timed out or returned invalid JSON.",
      );
    }
  }

  private async connect(signal?: AbortSignal) {
    if (this.ready) return;
    const result = await this.rpc(
      "initialize",
      {
        protocolVersion: versions[0],
        capabilities: {},
        clientInfo: { name: "birdeye-cli", version: "0.4.0" },
      },
      signal,
    );
    if (
      !versions.includes(result.protocolVersion) ||
      !result.capabilities?.tools
    )
      throw new AppError(
        "MCP_PROTOCOL_ERROR",
        "Birdeye MCP does not support the expected protocol or tools capability.",
      );
    this.version = result.protocolVersion;
    this.ready = true;
    try {
      await this.rpc("notifications/initialized", {}, signal, true);
    } catch (error) {
      this.ready = false;
      throw error;
    }
  }

  async listTools(signal?: AbortSignal, refresh = false): Promise<McpTool[]> {
    if (this.catalog && !refresh) return this.catalog;
    await this.connect(signal);
    const tools = new Map<string, McpTool>();
    const cursors = new Set<string>();
    let cursor: string | undefined;
    let size = 0;
    for (let page = 0; page < 50; page++) {
      const result = await this.rpc(
        "tools/list",
        cursor ? { cursor } : {},
        signal,
      );
      size += JSON.stringify(result).length;
      if (size > 2_000_000)
        throw new AppError(
          "MCP_CATALOG_LIMIT",
          "Birdeye MCP catalog exceeds 2 MB.",
        );
      const parsed = z.array(toolSchema).safeParse(result.tools);
      if (!parsed.success)
        throw new AppError(
          "MCP_PROTOCOL_ERROR",
          "Birdeye MCP returned an invalid tool catalog.",
        );
      for (const tool of parsed.data) tools.set(tool.name, tool);
      if (tools.size > 1000)
        throw new AppError(
          "MCP_CATALOG_LIMIT",
          "Birdeye MCP catalog exceeds 1000 tools.",
        );
      if (result.nextCursor === undefined) {
        this.catalog = [...tools.values()];
        return this.catalog;
      }
      if (
        typeof result.nextCursor !== "string" ||
        !result.nextCursor ||
        cursors.has(result.nextCursor)
      )
        throw new AppError(
          "MCP_PROTOCOL_ERROR",
          "Birdeye MCP returned invalid pagination.",
        );
      cursor = result.nextCursor;
      cursors.add(cursor!);
    }
    throw new AppError(
      "MCP_CATALOG_LIMIT",
      "Birdeye MCP catalog exceeds 50 pages.",
    );
  }

  async getTool(name: string, signal?: AbortSignal) {
    const tool = (await this.listTools(signal)).find(
      (tool) => tool.name === name,
    );
    if (!tool)
      throw new AppError(
        "MCP_TOOL_NOT_FOUND",
        "Tool is not in the discovered Birdeye MCP catalog. Search tools first.",
      );
    return tool;
  }

  async validateCall(name: string, args: Data, signal?: AbortSignal) {
    const tool = await this.getTool(name, signal);
    if (
      tool.annotations?.destructiveHint === true &&
      tool.annotations.readOnlyHint !== true
    )
      throw new AppError(
        "MCP_TOOL_DENIED",
        "Destructive MCP tools are not available to the research agent.",
      );
    let schema: z.ZodType;
    try {
      schema = z.fromJSONSchema(tool.inputSchema);
    } catch {
      throw new AppError(
        "MCP_SCHEMA_UNSUPPORTED",
        "This MCP input schema cannot be validated locally.",
      );
    }
    if (!schema.safeParse(args).success)
      throw new AppError(
        "MCP_INVALID_ARGUMENTS",
        "Arguments do not match the MCP input schema. Read the tool definition and correct the arguments.",
      );
  }

  async callTool(name: string, args: Data, signal?: AbortSignal) {
    await this.validateCall(name, args, signal);
    const result = await this.rpc(
      "tools/call",
      { name, arguments: args },
      signal,
    );
    if (
      !Array.isArray(result.content) ||
      (result.isError !== undefined && typeof result.isError !== "boolean")
    )
      throw new AppError(
        "MCP_PROTOCOL_ERROR",
        "Birdeye MCP returned an invalid tool result; billing is uncertain.",
      );
    return result;
  }

  async close() {
    const session = this.session;
    this.ready = false;
    this.session = undefined;
    this.catalog = undefined;
    if (!session) return;
    try {
      const response = await (this.options.fetch || fetch)(BIRDEYE_MCP_URL, {
        method: "DELETE",
        redirect: "error",
        signal: AbortSignal.timeout(2000),
        headers: {
          "Mcp-Session-Id": session,
          "MCP-Protocol-Version": this.version,
          ...(this.key ? { "x-api-key": this.key } : {}),
        },
      });
      await response.body?.cancel();
    } catch {
      /* Session cleanup must not discard research results. */
    }
  }
}
