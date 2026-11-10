import { Readable, Writable } from "node:stream";
import type { IncomingMessage, ServerResponse } from "node:http";

// Exercises the real Node HTTP handler without opening a network socket.
export function inProcessFetch(
  handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>,
  origin: string,
): typeof fetch {
  return async (input, init = {}) => {
    const url = new URL(String(input));
    const headers = Object.fromEntries(new Headers(init.headers).entries());
    headers.host = new URL(origin).host;
    const req = Object.assign(
      Readable.from(init.body ? [Buffer.from(String(init.body))] : []),
      { method: init.method || "GET", url: url.pathname + url.search, headers },
    );
    const out: Buffer[] = [];
    const responseHeaders: Record<string, string> = {};
    let status = 200;
    const res = Object.assign(
      new Writable({
        write(chunk, _encoding, done) {
          out.push(Buffer.from(chunk));
          done();
        },
      }),
      {
        headersSent: false,
        setHeader(name: string, value: string) {
          responseHeaders[name.toLowerCase()] = value;
        },
        writeHead(code: number, values: Record<string, string>) {
          status = code;
          Object.assign(responseHeaders, values);
          res.headersSent = true;
          return res;
        },
      },
    );
    const done = new Promise<void>((resolve, reject) => {
      res.on("finish", resolve);
      res.on("error", reject);
    });
    await handler(
      req as unknown as IncomingMessage,
      res as unknown as ServerResponse,
    );
    await done;
    return new Response(Buffer.concat(out), {
      status,
      headers: responseHeaders,
    });
  };
}
