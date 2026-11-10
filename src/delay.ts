export function delay(
  ms: number,
  _value?: unknown,
  options: { signal?: AbortSignal } = {},
) {
  return new Promise<void>((resolve, reject) => {
    const signal = options.signal;
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    const abort = () => {
      clearTimeout(timer);
      reject(signal?.reason);
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", abort);
      resolve();
    }, ms);
    signal?.addEventListener("abort", abort, { once: true });
  });
}
