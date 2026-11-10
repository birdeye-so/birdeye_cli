export function normalizeDemoHost(value: string): string {
  const message =
    "demo-host must be an HTTP(S) origin without credentials, path, query or fragment, e.g. https://support-api.owland.xyz/";
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(message);
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw new Error(message);
  return url.origin;
}
