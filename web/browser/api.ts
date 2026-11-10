import { getRuntime } from "./runtime";
export function createApiClient() {
  return async (path: string, input?: unknown, signal?: AbortSignal) => {
    signal?.throwIfAborted();
    const result = await getRuntime().request(path, input);
    signal?.throwIfAborted();
    return result;
  };
}
export function createRunEvents(id: string) {
  return getRuntime().events(id);
}
