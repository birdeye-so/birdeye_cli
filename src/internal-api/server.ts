import http, { type IncomingMessage, type ServerResponse } from "node:http";
import { AppError, errorData, integer } from "../shared.js";
import {
  ResearchRunError,
  ResearchService,
  type ResearchEndpoint,
} from "./service.js";

const bodyLimit = 64 * 1024;
async function readBody(req: IncomingMessage) {
  if (
    req.headers["content-type"]?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    throw new AppError("CONTENT_TYPE", "Send Content-Type: application/json.");
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req.iterator({ destroyOnReturn: false })) {
    const bytes = Buffer.from(chunk);
    size += bytes.length;
    if (size > bodyLimit) {
      req.resume();
      throw new AppError("BODY_TOO_LARGE", "JSON body must not exceed 64 KiB.");
    }
    chunks.push(bytes);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new AppError("INVALID_INPUT", "Send a valid JSON object.");
  }
}

function json(res: ServerResponse, status: number, data: unknown) {
  if (res.destroyed || res.writableEnded) return;
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(data));
}

export async function startInternalApi(options: {
  service: ResearchService;
  host?: string;
  port?: number;
  listen?: boolean;
}) {
  const host = options.host ?? "127.0.0.1",
    port = integer(options.port ?? 8788, "port", 0, 65535);
  const { service } = options;

  async function handler(req: IncomingMessage, res: ServerResponse) {
    const controller = new AbortController();
    const disconnect = () => {
      if (!res.writableEnded) controller.abort();
    };
    res.once("close", disconnect);
    req.once("aborted", disconnect);
    try {
      const url = new URL(req.url ?? "/", "http://internal.invalid");
      if (req.headers.origin)
        throw new AppError(
          "ORIGIN_DENIED",
          "This API accepts server-to-server requests; browser origins are not enabled.",
        );
      if (url.pathname === "/health" && req.method === "GET") {
        json(res, service.isClosing ? 503 : 200, {
          status: service.isClosing ? "closing" : "ok",
        });
        return;
      }
      const endpoint: ResearchEndpoint | undefined =
        url.pathname === "/price-surge"
          ? "price-surge"
          : url.pathname === "/token-dd"
            ? "token-dd"
            : undefined;
      if (!endpoint) {
        json(res, 404, {
          error: { code: "NOT_FOUND", message: "Endpoint not found." },
        });
        return;
      }
      if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        json(res, 405, {
          error: {
            code: "METHOD_NOT_ALLOWED",
            message: "Use POST with JSON inputs.",
          },
        });
        return;
      }
      if (url.search)
        throw new AppError(
          "INVALID_INPUT",
          "Pass research inputs in the JSON body, not query parameters.",
        );
      const input = await readBody(req);
      const apiKey = req.headers["x-api-key"];
      if (Array.isArray(apiKey))
        throw new AppError("AUTH_INVALID", "Send a single X-API-KEY header.");
      const result = await service.run(endpoint, input, {
        apiKey,
        signal: controller.signal,
      });
      json(res, 200, result);
    } catch (error) {
      const detail = errorData(error);
      const statuses: Record<string, number> = {
        INVALID_INPUT: 400,
        ORIGIN_DENIED: 403,
        RUN_BUSY: 409,
        BODY_TOO_LARGE: 413,
        CONTENT_TYPE: 415,
        AUTH_MISSING: 401,
        AUTH_INVALID: 401,
        SERVICE_CLOSING: 503,
        RUN_STORAGE_FAILED: 500,
        CANCELLED: 503,
      };
      json(
        res,
        statuses[detail.code] ??
          (error instanceof ResearchRunError ? 502 : 500),
        {
          error: detail,
          ...(error instanceof ResearchRunError
            ? {
                run_id: error.runId,
                ...(error.result ? { result: error.result } : {}),
              }
            : {}),
        },
      );
    } finally {
      res.off("close", disconnect);
      req.off("aborted", disconnect);
    }
  }
  const server = http.createServer(
    { requestTimeout: 15_000, headersTimeout: 10_000, maxHeaderSize: 16_384 },
    handler,
  );
  if (options.listen !== false)
    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen(port, host, () => {
        server.off("error", reject);
        resolve();
      });
    }).catch((error: NodeJS.ErrnoException) => {
      throw new AppError(
        "BIND_FAILED",
        `Cannot listen on ${host}:${port} (${error.code ?? "unknown error"}).`,
      );
    });
  const address = server.address();
  const actualPort =
    typeof address === "object" && address ? address.port : port;
  const url = `http://${host.includes(":") ? `[${host}]` : host}:${actualPort}`;
  async function close() {
    const drained = service.close(); // Prevent new work and cancel paid calls first.
    const stopped = server.listening
      ? new Promise<void>((resolve) => {
          server.close(() => resolve());
          server.closeAllConnections();
        })
      : Promise.resolve();
    await Promise.all([drained, stopped]);
  }
  return { server, handler, url, close };
}
