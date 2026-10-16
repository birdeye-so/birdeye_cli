import { setTimeout as delay } from "node:timers/promises";
import { prepare, PRICING_VERSION } from "./catalog.js";
import { credentialId } from "./config.js";
import { Ledger } from "./ledger.js";
import { AppError, parseData, now, object, type Data } from "./shared.js";
import { BirdeyeMcp, BIRDEYE_MCP_URL } from "./mcp.js";

export type Result = { schemaVersion: number; data: any; meta: Data };
export class Runner {
  constructor(
    public ledger: Ledger,
    private key: string,
    private options: {
      fetch?: typeof fetch;
      baseUrl?: string;
      retries?: number;
      timeoutMs?: number;
    } = {},
  ) {}
  async executeMcp(client: BirdeyeMcp, name: string, args: Data, context: {run: string; signal?: AbortSignal}): Promise<Result> {
    await client.validateCall(name, args, context.signal);
    context.signal?.throwIfAborted();
    const operation = `mcp.${name}`;
    const id = this.ledger.reserve(context.run, operation, null, credentialId(this.key));
    try {
      if (context.signal?.aborted) {
        this.ledger.finish(id, "not-sent");
        context.signal.throwIfAborted();
      }
      const data = await client.callTool(name, args, context.signal);
      this.ledger.finish(id, "completed");
      return {
        schemaVersion: 1, data,
        meta: {
          operation, params: args, chain: args.chain ?? args.network ?? "unspecified",
          retrievedAt: now(), runId: context.run, requestId: id,
          endpoint: BIRDEYE_MCP_URL, method: "tools/call", transport: "mcp",
          cu: this.ledger.summary(context.run), pricingStatus: "unknown", estimatedCu: null,
          coverage: data.isError ? "empty" : "unverified", isError: data.isError === true,
          warnings: [
            "MCP CU cost is unknown and excluded from estimated/reserved totals. Request limits apply; CU budgets cannot bound MCP charges.",
            ...(data.isError ? ["Birdeye MCP returned a tool error; this is not successful market evidence."] : []),
          ],
        },
      };
    } catch (error) {
      this.ledger.finish(id, "uncertain");
      throw error;
    }
  }
  estimate(operation: string, params: unknown, chain = "solana") {
    const p = prepare(operation, params, chain);
    return {
      operation,
      params: p.params,
      chain,
      estimatedCu: p.entry.cost,
      upperBoundCu: p.entry.cost,
      pricingVersion: PRICING_VERSION,
      pricingStatus: p.entry.provisional ? "provisional" : "verified",
      note: p.entry.provisional
        ? "Conservative documented upper bound; actual billing is not confirmed."
        : "Documentation estimate, not confirmed billing.",
    };
  }
  async execute(
    operation: string,
    params: unknown,
    context: { run: string; chain?: string; signal?: AbortSignal },
  ): Promise<Result> {
    const p = prepare(operation, params, context.chain);
    if (!this.key)
      throw new AppError(
        "AUTH_MISSING",
        "Set BIRDEYE_API_KEY or configure the key in Settings.",
      );
    const url = new URL(
      p.entry.path,
      this.options.baseUrl || "https://public-api.birdeye.so",
    );
    const method = p.entry.method || "GET";
    if (method === "GET")
      for (const [key, value] of Object.entries(p.params))
        if (value !== undefined)
          url.searchParams.set(key, Array.isArray(value) ? value.join(",") : String(value));
    if (operation === "market.ohlcv") {
      url.searchParams.set("mode", "range");
      url.searchParams.set("currency", "usd");
    }
    const identity = credentialId(this.key);
    const retryCount = this.options.retries ?? 1;
    for (let attempt = 0; attempt <= retryCount; attempt++) {
      context.signal?.throwIfAborted();
      const id = this.ledger.reserve(
        context.run,
        operation,
        p.entry.cost,
        identity,
      );
      let retryAfter = 0;
      try {
        if (context.signal?.aborted) {
          this.ledger.finish(id, "not-sent");
          context.signal.throwIfAborted();
        }
        const signal = AbortSignal.any([
          AbortSignal.timeout(this.options.timeoutMs ?? 20000),
          ...(context.signal ? [context.signal] : []),
        ]);
        const response = await (this.options.fetch || fetch)(url, {
          method,
          ...(method === "POST" ? { body: JSON.stringify(p.entry.requestBody?.(p.params) ?? p.params) } : {}),
          headers: {
            "X-API-KEY": this.key,
            "x-chain": p.chain,
            accept: "application/json",
            ...(method === "POST" ? { "Content-Type": "application/json" } : {}),
          },
          signal,
          redirect: "error",
        });
        const retryHeader = response.headers.get("retry-after");
        if (retryHeader)
          retryAfter = /^\d+(\.\d+)?$/.test(retryHeader)
            ? Number(retryHeader) * 1000
            : Math.max(0, Date.parse(retryHeader) - Date.now());
        if (!response.ok) {
          await response.body?.cancel();
          const code =
            response.status === 401
              ? "AUTH_INVALID"
              : response.status === 403
                ? "ACCESS_DENIED"
                : response.status === 429
                  ? "RATE_LIMIT"
                  : "UPSTREAM_ERROR";
          throw new AppError(
            code,
            `Birdeye returned HTTP ${response.status}.`,
            response.status === 429 || response.status >= 500,
          );
        }
        const raw = await response.text();
        if (raw.length > 20_000_000)
          throw new AppError(
            "RESPONSE_TOO_LARGE",
            "Birdeye response exceeded 20 MB. Reduce the query.",
          );
        let parsed: unknown;
        try { parsed = parseData(raw); }
        catch { throw new AppError("API_RESPONSE_INVALID", "Birdeye returned invalid JSON; billing is uncertain."); }
        const body = object(parsed);
        const bare = p.entry.bareArray && Array.isArray(parsed);
        const hasData = Object.hasOwn(body, "data");
        const success = body.success === true || body.success === 1;
        const compatibleEnvelope = p.entry.dataWithoutSuccess && !Object.hasOwn(body, "success") && hasData;
        if ((!bare && (!(success || compatibleEnvelope) || !hasData)) || body.error != null)
          throw new AppError(
            "API_RESPONSE_INVALID",
            `Birdeye returned an unsupported response envelope for ${operation}; billing is uncertain.`,
            false,
            {operation, endpoint: p.entry.path, responseType: Array.isArray(parsed) ? "array" : parsed === null ? "null" : typeof parsed, hasData, successType: typeof body.success},
          );
        const data = bare ? parsed : body.data;
        if (data !== null && p.entry.dataSchema && !p.entry.dataSchema.safeParse(data).success)
          throw new AppError("API_RESPONSE_INVALID", `Unexpected data shape for ${operation}; no metrics inferred.`);
        this.ledger.finish(id, "completed", p.entry.cost);
        if (operation === "usage.credits")
          this.ledger.snapshot(identity, body.data);
        const d = object(data);
        const rows = Array.isArray(data) ? data : p.entry.rowsKey ? d[p.entry.rowsKey] : d.items || d.tokens;
        const warnings = p.entry.provisional
          ? [
              `${operation} reserves an upper bound of ${p.entry.cost} CU per request; actual billing is not confirmed.`,
            ]
          : [];
        warnings.push(...(p.entry.warnings || []));
        if (operation === "portfolio.holdings")
          warnings.push(
            "One page only. Birdeye excludes low-liquidity assets by default.",
          );
        return {
          schemaVersion: 1,
          data,
          meta: {
            operation,
            params: p.params,
            chain: p.chain,
            retrievedAt: now(),
            runId: context.run,
            requestId: id,
            endpoint: p.entry.path,
            method,
            cu: this.ledger.summary(context.run),
            coverage:
              data === null || (Array.isArray(rows) && rows.length === 0) || (data && !Array.isArray(data) && Object.keys(d).length === 0)
                ? "empty"
                : p.entry.paginated
                  ? "page"
                  : "complete",
            pagination: p.entry.paginated
              ? {
                  offset: p.params.offset,
                  limit: p.params.limit,
                  returned: Array.isArray(rows) ? rows.length : 0,
                  total: d.total ?? d.holder ?? body.pagination?.total ?? null,
                  hasMore: d.has_more ?? d.has_next ?? d.hasNext ?? null,
                  nextTimeFrom: d.next_time_from ?? null,
                }
              : undefined,
            warnings,
          },
        };
      } catch (error) {
        this.ledger.finish(id, "uncertain");
        if (context.signal?.aborted) context.signal.throwIfAborted();
        const e =
          error instanceof AppError
            ? error
            : new AppError(
                "NETWORK_ERROR",
                "Birdeye request failed or timed out; billing is uncertain.",
                true,
              );
        if (!e.retryable || attempt === retryCount || retryAfter > 30000)
          throw e;
        await delay(Math.max(retryAfter || 0, 300 * 2 ** attempt), undefined, {
          signal: context.signal,
        });
      }
    }
    throw new AppError("UPSTREAM_ERROR", "Birdeye request did not complete.");
  }
}
