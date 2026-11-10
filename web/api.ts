export function createApiClient(
  fetcher: typeof fetch = (...args) => fetch(...args),
) {
  let reconnecting: Promise<void> | undefined;
  async function request(path: string, input?: unknown, signal?: AbortSignal) {
    const response = await fetcher(
      `/api${path}`,
      input === undefined
        ? { signal }
        : {
            signal,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
          },
    );
    const body = await response.json();
    if (!response.ok)
      throw Object.assign(new Error(body.error?.message || "Request failed."), {
        status: response.status,
        code: body.error?.code,
      });
    return body;
  }
  return async function api(
    path: string,
    input?: unknown,
    signal?: AbortSignal,
  ) {
    try {
      return await request(path, input, signal);
    } catch (error) {
      const failure = error as { status?: number; code?: string };
      // CONNECT_REQUIRED is emitted before dispatch, so no mutation was performed.
      // Only retry this explicit rejection, never network errors or failed writes.
      if (
        path === "/connect" ||
        failure.status !== 401 ||
        failure.code !== "CONNECT_REQUIRED"
      )
        throw error;
      // The terminal link carries the code in #code=; without it the user enters the code.
      const code =
        new URLSearchParams(globalThis.location?.hash.slice(1)).get("code") ??
        undefined;
      reconnecting ??= request("/connect", { code })
        .then(() => {
          if (code)
            globalThis.history?.replaceState(
              null,
              "",
              globalThis.location.pathname + globalThis.location.search,
            );
        })
        .finally(() => {
          reconnecting = undefined;
        });
      try {
        await reconnecting;
      } catch {
        throw error;
      }
      return request(path, input, signal);
    }
  };
}

export function createRunEvents(id: string) {
  return new EventSource(`/api/runs/${id}/events`);
}
