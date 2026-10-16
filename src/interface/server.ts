import http, { type IncomingMessage, type ServerResponse } from "node:http";
import https from "node:https";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { Ledger } from "../ledger.js";
import { RunStore } from "../run-store.js";
import { KnowledgeBase } from "../knowledge.js";
import { Runner, type Result } from "../runner.js";
import { BirdeyeMcp } from "../mcp.js";
import {
  configDir,
  configPath,
  readConfig,
  saveConfig,
  safeConfig,
  dataKey,
  activeProfile,
  profileSchema,
  validateProviderUrl,
  type Config,
} from "../config.js";
import { runCase, caseSchema } from "../analysis.js";
import { caseKinds, planCase, workflowCatalog, type CaseInput } from "../workflows.js";
import { runChat, type AIUsage } from "../ai.js";
import { AppError, errorData, integer, now, type Data } from "../shared.js";
import { capabilities, prepare } from "../catalog.js";
import { previewCase } from "../workflow-preview.js";
import {WorkflowImports,planImported,runImported,importRuntimeSchema} from "../workflow-import.js";
import {githubDocuments,sourceDocument} from "../workflow-sources.js";
import {demoCatalog,demoInputSchema,planDemo,runDemo} from "../demos.js";

const operationSchema = z
  .object({
    operation: z.string(),
    params: z.record(z.string(), z.unknown()).default({}),
  })
  .strict();
const requestSchema = z
  .object({
    mode: z.enum(["case", "chat", "operation", "imported", "demo"]),
    demo: demoInputSchema.optional(),
    importId: z.string().uuid().optional(),
    importParams: importRuntimeSchema.optional(),
    case: caseSchema.optional(),
    workflowKind: z.enum(caseKinds).optional(),
    query: operationSchema.optional(),
    question: z.string().min(1).max(10000).optional(),
    parentId: z.string().optional(),
    dataPolicy: z.enum(["saved-only","live"]).optional(),
    maxCu: z.number().int().min(0).max(100000).optional(),
    short: z.boolean().optional(),
  })
  .strict();
export type RunRequest = z.infer<typeof requestSchema>;
type Run = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  result?: Result;
  error?: unknown;
  cu?: unknown;
  ai: AIUsage;
  question?: string;
  input: RunRequest;
  savedAt?: string;
  storageError?: string;
  events: Data[];
  controller: AbortController;
  listeners: Set<ServerResponse>;
  task?: Promise<void>;
};
export type ServerOptions = {
  bind?: string;
  dir?: string;
  ledger: Ledger;
  config?: Config;
  maxCu?: number;
  sessionMaxCu?: number;
  short?: boolean;
  aiProfile?: string;
  requireCode?: boolean;
  initial?: { operation: string; params: Data };
  initialCase?: CaseInput;
  initialRunId?: string;
  tlsCert?: string;
  tlsKey?: string;
  publicUrl?: string;
  runnerFactory?: (config: Config) => Runner;
  aiFetch?: typeof fetch;
  mcpFetch?: typeof fetch;
  importFetch?: typeof fetch;
  listen?: boolean;
};

export function parseBind(bind = "127.0.0.1:3000") {
  const match = /^(?:\[([^\]]+)\]|([^:\s/]+)):(\d+)$/.exec(bind);
  if (!match)
    throw new AppError("INVALID_BIND", "Use host:port, or [IPv6]:port.");
  return {
    host: match[1] || match[2],
    port: integer(match[3], "port", 0, 65535),
  };
}
async function body(req: IncomingMessage, maxBytes = 65536) {
  if (!req.headers["content-type"]?.startsWith("application/json"))
    throw new AppError("CONTENT_TYPE", "Use application/json.");
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes)
      throw new AppError("BODY_TOO_LARGE", `Request exceeds ${maxBytes} bytes.`);
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new AppError("INVALID_JSON", "Invalid JSON request.");
  }
}
function json(res: ServerResponse, code: number, value: unknown) {
  res.writeHead(code, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(value));
}
function equals(a: string, b: string) {
  return (
    Buffer.byteLength(a) === Buffer.byteLength(b) &&
    timingSafeEqual(Buffer.from(a), Buffer.from(b))
  );
}

export async function startInterface(options: ServerOptions) {
  const { host, port } = parseBind(options.bind);
  const loopback = ["localhost", "127.0.0.1", "::1"].includes(host);
  if (!!options.tlsCert !== !!options.tlsKey)
    throw new AppError("TLS_CONFIG", "Provide both --tls-cert and --tls-key.");
  const secure = !!options.tlsCert;
  if (!loopback && !secure)
    throw new AppError(
      "TLS_REQUIRED",
      "Non-loopback bind requires --tls-cert and --tls-key. For SSH, bind 127.0.0.1 instead.",
    );
  if (["0.0.0.0", "::"].includes(host) && !options.publicUrl)
    throw new AppError(
      "PUBLIC_URL_REQUIRED",
      "Wildcard bind requires --public-url with the HTTPS address you will open.",
    );
  if (
    options.publicUrl &&
    new URL(options.publicUrl).protocol !== (secure ? "https:" : "http:")
  )
    throw new AppError(
      "PUBLIC_URL_INVALID",
      "Public URL protocol must match the server.",
    );
  const dir = options.dir || configDir();
  let config = options.config || readConfig(dir);
  let settingsPersisted = !options.config;
  const autoConnect = loopback && !options.publicUrl && !options.requireCode;
  const connectCode = randomBytes(24).toString("base64url");
  let codeAvailable = true;
  const session = randomBytes(32).toString("base64url");
  let origin = "";
  const allowedHosts = new Set<string>();
  const runs = new Map<string, Run>();
  const archive = new RunStore(options.ledger);
  const imports = new WorkflowImports(options.ledger);
  let knowledge: KnowledgeBase | undefined;
  const docs = () => knowledge ||= new KnowledgeBase(options.ledger);
  if (options.initialRunId) archive.get(options.initialRunId);
  let initialId = options.initialRunId;
  let initialRemoved = false;
  const sessionWorkflow =
    options.sessionMaxCu === undefined
      ? undefined
      : options.ledger.createWorkflow("interface session", options.sessionMaxCu)
          .id;
  let active = false;
  let closing = false;
  let loginAttempts: number[] = [];
  const runner = () =>
    options.runnerFactory?.(config) ||
    new Runner(options.ledger, dataKey(config));
  function publicRun(run: Run) {
    return {
      id: run.id,
      title: run.title,
      status: run.status,
      createdAt: run.createdAt,
      input: run.input,
      saved: !!run.savedAt && !run.storageError,
      savedAt: run.savedAt,
      storageError: run.storageError,
      fromStorage: false,
      result: run.result,
      error: run.error,
      cu: options.ledger.summary(run.id),
      ai: run.ai,
      events: run.events.filter((e) => e.type === "progress"),
    };
  }
  function save(run: Run) {
    try { run.savedAt = archive.save(run); run.storageError = undefined; }
    catch (error) { run.storageError = (error as Error).message; throw error; }
  }
  function history(before?: number) {
    const page = archive.list(50, before);
    return {...page, items: page.items.map(item => {
      const live = runs.get(item.id);
      return live ? {...item, status:live.status, saved:!live.storageError} : item;
    })};
  }
  function ancestors(id:string|undefined,limit=20) {
    const entries:(Run | ReturnType<RunStore["get"]>)[]=[];
    const visited=new Set<string>();
    while(id && !visited.has(id) && entries.length<limit) {
      visited.add(id);
      let entry:Run | ReturnType<RunStore["get"]>;
      try {entry = runs.get(id) || archive.get(id);}
      catch(error) {
        if(entries.length && error instanceof AppError && error.code === "RUN_NOT_FOUND") break;
        throw error;
      }
      entries.unshift(entry);id=entry.input.parentId;
    }
    return {entries,truncated:!!id};
  }
  function emit(run: Run, type: string, payload: unknown) {
    const event = { seq: run.events.length + 1, type, data: payload };
    run.events.push(event);
    for (const res of run.listeners)
      res.write(`id: ${event.seq}\ndata: ${JSON.stringify(event)}\n\n`);
  }
  function launch(input: RunRequest) {
    if (active || closing)
      throw new AppError(
        "RUN_BUSY",
        "A run is already active. Stop it or wait for completion.",
      );
    // Bound in-memory reports; older results remain available through SQLite.
    if (runs.size >= 20) for (const [id, run] of runs) {
      if (runs.size < 20) break;
      if (run.status !== "running" && !run.storageError) runs.delete(id);
    }
    const demoPlan=input.mode === "demo" ? planDemo(input.demo) : undefined;
    if(demoPlan) {input.demo=demoPlan.demoInput;input.case=demoPlan.input;}
    if (input.mode === "case") {
      if (!input.case)
        throw new AppError("INVALID_INPUT", "Choose a case study.");
      input.case = planCase(input.case).input;
    }
    if (input.mode === "operation") {
      if (!input.query)
        throw new AppError("INVALID_INPUT", "Choose an operation.");
      prepare(input.query.operation, input.query.params);
    }
    const imported = input.mode === "imported" ? imports.get(input.importId || "") : undefined;
    const importedPlan = imported ? planImported(imported,input.importParams) : undefined;
    const profile = activeProfile(config, options.aiProfile);
    if (input.mode === "chat" && (!input.question || !profile))
      throw new AppError(
        "AI_CONFIG_MISSING",
        "Configure an AI profile and enter a question.",
      );
    // Validate reuse and index docs before allocating a paid run.
    const parent = input.parentId ? (runs.get(input.parentId) || archive.get(input.parentId)) : undefined;
    if(input.mode === "chat") {
      input.dataPolicy ??= parent?.input.mode === "chat" ? parent.input.dataPolicy ?? "live" : "live";
      if (input.dataPolicy === "saved-only") input.maxCu = 0;
      if (!input.case && (!input.workflowKind || input.workflowKind === parent?.input.case?.kind))
        input.case = parent?.input.case;
      input.workflowKind ??= input.case?.kind || parent?.input.workflowKind;
      if (input.case) {
        if (input.workflowKind !== input.case.kind)
          throw new AppError("INVALID_INPUT", "Selected workflow does not match its input.");
        input.case = planCase(input.case).input;
      }
      docs();
    }
    const id = options.ledger.createRun(
      input.maxCu ?? options.maxCu ?? 250,
      sessionWorkflow,
      demoPlan ? Math.max(20,demoPlan.maxRequests*2) : importedPlan ? Math.max(20,importedPlan.maxRequests*2) : input.mode === "case" && input.case ? Math.max(20, planCase(input.case).maxRequests * 2) : 20,
    );
    const run: Run = {
      id,
      title:
        demoPlan?.demo.title ||
        input.question ||
        (input.case && workflowCatalog().find(c => c.kind === input.case?.kind)?.title) ||
        imported?.title || input.case?.kind ||
        input.query?.operation ||
        "Analysis",
      status: "running",
      createdAt: now(),
      controller: new AbortController(),
      listeners: new Set(),
      events: [],
      ai: { inputTokens: 0, outputTokens: 0, calls: 0, unknownCalls: 0 },
      question: input.question,
      input,
    };
    const execute = runner();
    save(run); // Fail before any paid request if storage cannot be written.
    runs.set(id, run);
    active = true;
    const progress = (stage: string, message: string) =>
      emit(run, "progress", { stage, message, cu: options.ledger.summary(id) });
    run.task = (async () => {
      try {
        progress("planning", "Preparing bounded data requests");
        if (demoPlan)
          run.result=await runDemo(execute,id,demoPlan.demoInput,run.controller.signal,progress,result=>{run.result=result;save(run);});
        else if (imported)
          run.result = await runImported(execute,id,imported,input.importParams,run.controller.signal,progress,result=>{run.result=result;save(run);});
        else if (input.mode === "operation")
          run.result = await execute.execute(
            input.query!.operation,
            input.query!.params,
            { run: id, signal: run.controller.signal },
          );
        else if (input.mode === "case")
          run.result = await runCase(
            execute,
            id,
            input.case,
            run.controller.signal,
            progress,
            (result) => {
              run.result = result;
              save(run);
            },
          );
        else {
          const history = ancestors(parent?.id,3).entries.filter(p=>p.result).flatMap(previous=>[
                  { role: "user", content: previous.input.question || previous.title },
                  {
                    role: "assistant",
                    content: JSON.stringify({
                      answer: previous.result!.data.answer,
                      metrics: previous.result!.data.metrics,
                      asOf: previous.result!.meta.retrievedAt,
                      note: "Previous run context; not current market data.",
                    }).slice(0, 18000),
                  },
                ]);
          run.result = await runChat(execute, id, profile!, input.question!, {
            signal: run.controller.signal,
            short: input.short ?? options.short,
            history,
            knowledge: docs(),
            mcp: new BirdeyeMcp(dataKey(config), {fetch: options.mcpFetch}),
            dataPolicy: input.dataPolicy || "live",
            workflow: input.workflowKind ? {kind: input.workflowKind, input: input.case} : undefined,
            savedRunId: parent?.id,
            savedSources: parent?.result ? (parent.result.meta.operation === "analysis" ? parent.result.data.sources || [] : [parent.result]) : [],
            progress,
            fetch: options.aiFetch,
            usage: run.ai,
            evidence: (result) => {
              run.result = result;
              save(run);
            },
          });
        }
        run.status =
          run.result.meta.coverage === "partial" ? "partial" : "completed";
      } catch (error) {
        run.status = run.controller.signal.aborted ? "cancelled" : "failed";
        run.error = errorData(error);
        if (run.result) {
          run.result.meta.coverage = "partial";
          run.result.meta.cu = options.ledger.summary(id);
          run.result.meta.ai = run.ai;
          run.result.meta.warnings = [
            ...run.result.meta.warnings.filter(
              (w: string) => w !== "Analysis is still in progress.",
            ),
            `${run.status}: fetched evidence is retained; analysis is incomplete.`,
          ];
        }
      } finally {
        active = false;
        try { save(run); } catch { /* Keep unsaved evidence available for export. */ }
        emit(run, "done", publicRun(run));
        for (const res of run.listeners) res.end();
        run.listeners.clear();
      }
    })();
    return id;
  }
  async function handler(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
    );
    try {
      if (
        !allowedHosts.has(req.headers.host || "") ||
        (req.headers.origin !== undefined &&
          req.headers.origin !== `${secure ? "https" : "http"}://${req.headers.host}`) ||
        req.headers["sec-fetch-site"] === "cross-site"
      ) {
        json(res, 403, {
          error: {
            code: "ORIGIN_DENIED",
            message: "Host or Origin is not allowed.",
          },
        });
        return;
      }
      const path = new URL(req.url || "/", origin).pathname;
      if (path === "/api/connect" && req.method === "POST") {
        loginAttempts = loginAttempts.filter((t) => t > Date.now() - 60000);
        if (loginAttempts.length >= 10) {
          json(res, 429, {
            error: {
              message: "Too many connection attempts. Wait one minute.",
            },
          });
          return;
        }
        loginAttempts.push(Date.now());
        const input = await body(req);
        const localConnect = input.local === true && autoConnect &&
          req.headers["sec-fetch-site"] === "same-origin" &&
          req.headers.origin === `${secure ? "https" : "http"}://${req.headers.host}`;
        if (
          !localConnect && (!codeAvailable ||
          typeof input.code !== "string" ||
          !equals(input.code, connectCode))
        ) {
          json(res, 401, {
            error: {
              message:
                "Invalid or already used connection code. Restart the server for a new code.",
            },
          });
          return;
        }
        if (!localConnect) codeAvailable = false;
        res.setHeader(
          "Set-Cookie",
          `birdeye_session=${session}; HttpOnly; SameSite=Strict; Path=/${secure ? "; Secure" : ""}`,
        );
        json(res, 200, { ok: true });
        return;
      }
      if (path.startsWith("/api/")) {
        const cookie =
          req.headers.cookie
            ?.split(";")
            .map((s) => s.trim())
            .find((s) => s.startsWith("birdeye_session="))
            ?.slice("birdeye_session=".length) || "";
        if (!equals(cookie, session)) {
          json(res, 401, {
            error: {
              code: "CONNECT_REQUIRED",
              message: "Enter the connection code printed in your terminal.",
            },
          });
          return;
        }
        if (path === "/api/status" && req.method === "GET") {
          const page = history();
          json(res, 200, {
            config: safeConfig(config),
            configStorage: {path: configPath(dir), persisted: settingsPersisted},
            activeAiProfile: options.aiProfile || config.ai.defaultProfile,
            capabilities: capabilities(),
            cases: workflowCatalog(),
            maxCu: options.maxCu ?? 250,
            short: !!options.short,
            active,
            activeRunId:
              [...runs.values()].find((r) => r.status === "running")?.id ||
              null,
            usage: options.ledger.summary(),
            runs: page.items,
            historyNextCursor: page.nextCursor,
            initialId,
          });
          return;
        }
        if (path === "/api/history" && req.method === "GET") {
          const before = new URL(req.url!, origin).searchParams.get("before");
          json(res, 200, history(before === null ? undefined : integer(before, "before", 1, Number.MAX_SAFE_INTEGER)));
          return;
        }
        if (path === "/api/knowledge" && req.method === "GET") {
          json(res,200,docs().info);return;
        }
        if (path === "/api/estimate" && req.method === "POST") {
          json(res, 200, planCase(await body(req)));
          return;
        }
        if (path === "/api/plan" && req.method === "POST") {
          json(res, 200, previewCase(await body(req)));
          return;
        }
        if(path === "/api/demos" && req.method === "GET") {json(res,200,{items:demoCatalog});return;}
        if(path === "/api/demos/plan" && req.method === "POST") {json(res,200,planDemo(await body(req),true));return;}
        if(path === "/api/workflow-imports" && req.method === "GET") {json(res,200,{items:imports.list()});return;}
        if(path === "/api/workflow-imports" && req.method === "POST") {
          const input=z.union([z.object({url:z.string().url(),ref:z.string().max(200).optional()}).strict(),z.object({name:z.string().min(1).max(200),content:z.string().min(1).max(256000)}).strict()]).parse(await body(req,2_000_000));
          const sources="url" in input ? await githubDocuments(input.url,options.importFetch,input.ref) : [sourceDocument(input.name,"upload:"+input.name,input.content)];
          const records=imports.import(sources);json(res,200,{items:records.map(r=>({id:r.id,title:r.title,executable:!!r.definition}))});return;
        }
        const importMatch=/^\/api\/workflow-imports\/([a-f0-9-]+)(?:\/(plan|export))?$/.exec(path);
        if(importMatch) {
          if(req.method === "POST" && importMatch[2] === "plan") {json(res,200,imports.preview(importMatch[1],await body(req)));return;}
          if(req.method === "GET") {json(res,200,importMatch[2] === "export" ? imports.get(importMatch[1]) : imports.preview(importMatch[1]));return;}
        }
        if (path === "/api/history/delete" && req.method === "POST") {
          const input = z.union([z.object({id:z.string().uuid()}).strict(), z.object({all:z.literal(true)}).strict()]).parse(await body(req));
          if(active) {
            json(res,409,{error:{code:"RUN_BUSY",message:"Wait for the active run to finish before deleting history."}});return;
          }
          const id = "id" in input ? input.id : undefined;
          const deleted = archive.remove(id);
          if(id === undefined) runs.clear(); else runs.delete(id);
          if(id === undefined || id === initialId) initialRemoved = true;
          json(res,200,{deleted});return;
        }
        if (path === "/api/settings" && req.method === "POST") {
          if (active)
            throw new AppError(
              "RUN_BUSY",
              "Wait for the current run before changing credentials.",
            );
          const input = z
            .object({
              birdeyeApiKey: z.string().max(4096).optional(),
              profile: profileSchema.optional(),
              profileName: z
                .string()
                .regex(/^[a-zA-Z0-9_-]{1,40}$/)
                .default("research"),
              persist: z.boolean().default(true),
            })
            .strict()
            .parse(await body(req));
          const updated: Config = structuredClone(config);
          if (input.birdeyeApiKey) updated.birdeyeApiKey = input.birdeyeApiKey;
          if (input.profile) {
            validateProviderUrl(input.profile.baseUrl);
            const prior = updated.ai.profiles[input.profileName];
            // A key belonging to a different origin must never follow a profile URL change.
            const preserve =
              prior &&
              new URL(prior.baseUrl).origin ===
                new URL(input.profile.baseUrl).origin
                ? prior.apiKey
                : undefined;
            updated.ai.profiles[input.profileName] = {
              ...input.profile,
              apiFormat: input.profile.apiFormat ?? prior?.apiFormat ?? "chat-completions",
              apiKey: input.profile.apiKey || preserve,
            };
            updated.ai.defaultProfile = input.profileName;
          }
          config = input.persist ? saveConfig(updated, dir) : updated;
          settingsPersisted = input.persist;
          json(res, 200, safeConfig(config));
          return;
        }
        if (path === "/api/initial" && req.method === "POST") {
          await body(req);
          if(initialRemoved) {json(res,200,{id:null});return;}
          if (options.initialCase && !initialId)
            initialId = launch({ mode: "case", case: options.initialCase });
          if (options.initial && !initialId)
            initialId = launch({ mode: "operation", query: options.initial });
          json(res, 200, { id: initialId || null });
          return;
        }
        if (path === "/api/runs" && req.method === "POST") {
          const input = requestSchema.parse(await body(req));
          json(res, 202, { id: launch(input) });
          return;
        }
        const match = /^\/api\/runs\/([a-f0-9-]+)(?:\/(events|stop|thread))?$/.exec(
          path,
        );
        if (match) {
          if(match[2] === "thread" && req.method === "GET") {
            const thread=ancestors(match[1]);
            const messages=thread.entries.filter(entry=>entry.input.mode==="chat").map(entry=>({id:entry.id,question:entry.input.question,answer:entry.result?.data.answer,status:entry.status,createdAt:entry.createdAt,docSources:entry.result?.data.docSources||[]}));
            json(res,200,{messages,truncated:thread.truncated});return;
          }
          const run = runs.get(match[1]);
          if (!run) {
            try {
              const saved = archive.get(match[1]);
              if (req.method === "GET" && !match[2]) json(res, 200, saved);
              else if (req.method === "GET" && match[2] === "events") {
                res.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-store"});
                res.end(`data: ${JSON.stringify({type:"done",data:saved})}\n\n`);
              } else json(res, 409, {error:{message:"This run is not active in this interface."}});
            } catch (error) {
              if (error instanceof AppError && error.code === "RUN_NOT_FOUND") json(res, 404, {error:errorData(error)});
              else throw error;
            }
            return;
          }
          if (match[2] === "stop" && req.method === "POST") {
            await body(req);
            run.controller.abort();
            json(res, 200, { ok: true });
            return;
          }
          if (req.method === "GET" && match[2] === "events") {
            res.writeHead(200, {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-store",
              Connection: "keep-alive",
            });
            const last = Number(req.headers["last-event-id"] || 0);
            for (const event of run.events)
              if (event.seq > last)
                res.write(
                  `id: ${event.seq}\ndata: ${JSON.stringify(event)}\n\n`,
                );
            if (run.status !== "running") {
              res.end();
              return;
            }
            run.listeners.add(res);
            const heartbeat = setInterval(
              () => res.write(": keepalive\n\n"),
              15000,
            );
            res.on("close", () => {
              clearInterval(heartbeat);
              run.listeners.delete(res);
            });
            return;
          }
          if (req.method === "GET" && !match[2]) {
            json(res, 200, publicRun(run));
            return;
          }
        }
        json(res, 404, { error: { message: "Route not found." } });
        return;
      }
      if (req.method !== "GET") {
        json(res, 405, { error: { message: "Method not allowed." } });
        return;
      }
      const assets: Record<string, [string, string]> = {
        "/": ["index.html", "text/html"],
        "/main.js": ["main.js", "text/javascript"],
        "/main.css": ["main.css", "text/css"],
      };
      const asset = assets[path];
      if (!asset) {
        json(res, 404, { error: { message: "Not found." } });
        return;
      }
      const file = fileURLToPath(
        new URL(`../web/${asset[0]}`, import.meta.url),
      );
      const contents = readFileSync(file);
      res.writeHead(200, {
        "Content-Type": asset[1],
        "Cache-Control": "no-store",
      });
      res.end(contents);
    } catch (error) {
      if (res.headersSent) {
        res.end();
        return;
      }
      const data =
        error instanceof z.ZodError
          ? {
              code: "INVALID_INPUT",
              message: error.issues.map((i) => i.message).join("; "),
              retryable: false,
            }
          : errorData(error);
      json(res, 400, { error: data });
    }
  }
  const server = secure
    ? https.createServer(
        {
          cert: readFileSync(options.tlsCert!),
          key: readFileSync(options.tlsKey!),
        },
        handler,
      )
    : http.createServer(handler);
  if (options.listen !== false)
    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen(port, host, () => {
        server.removeListener("error", reject);
        resolve();
      });
    }).catch((error: NodeJS.ErrnoException) => {
      throw new AppError(
        "BIND_FAILED",
        `Cannot listen on ${host}:${port} (${error.code || "unknown error"}). Choose another port or check local permissions.`,
      );
    });
  const address = server.address();
  const actualPort =
    typeof address === "object" && address ? address.port : port;
  const urlHost = host.includes(":") ? `[${host}]` : host;
  origin = options.publicUrl
    ? new URL(options.publicUrl).origin
    : `${secure ? "https" : "http"}://${urlHost}:${actualPort}`;
  allowedHosts.add(new URL(origin).host);
  // Local aliases are safe only for a loopback listener without an explicit
  // public URL. Browser Origin must still match the request's own Host above.
  if (loopback && !options.publicUrl) {
    for (const alias of ["localhost", "127.0.0.1", "[::1]"]) {
      allowedHosts.add(new URL(`${secure ? "https" : "http"}://${alias}:${actualPort}`).host);
    }
  }
  async function close() {
    closing = true;
    for (const run of runs.values())
      if (run.status === "running") run.controller.abort();
    await Promise.allSettled([...runs.values()].map((r) => r.task));
    if (server.listening)
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
        server.closeAllConnections();
      });
  }
  return { url: origin, connectCode, server, close, handler };
}
