import { ZodError } from "zod";
import { getRuntime } from "./runtime";
export function createApiClient() {
  return async (path: string, input?: unknown, signal?: AbortSignal) => {
    signal?.throwIfAborted();
    const result = await getRuntime()
      .request(path, input)
      .catch((error) => {
        // Same text the HTTP server sends; a raw ZodError message is the issue JSON.
        throw error instanceof ZodError
          ? new Error(error.issues.map((i) => i.message).join("; "))
          : error;
      });
    signal?.throwIfAborted();
    return result;
  };
}
export function createRunEvents(id: string) {
  return getRuntime().events(id);
}
