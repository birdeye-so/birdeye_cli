// Encoding recognition only: this does not establish that an account exists.
export type AddressEncoding = "base58" | "base64";
const alphabet58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export function addressEncoding(value: string): AddressEncoding | null {
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)) {
    let number = 0n;
    for (const char of value) number = number * 58n + BigInt(alphabet58.indexOf(char));
    let bytes = 0;
    while (number > 0n) { bytes++; number >>= 8n; }
    if (bytes + (value.match(/^1*/)?.[0].length ?? 0) === 32) return "base58";
  }
  // A 32-byte key is 43 unpadded or 44 padded base64 characters.
  if (!/^(?:[A-Za-z0-9+/]{43}|[A-Za-z0-9_-]{43})=?$/.test(value)) return null;
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/").replace(/=$/, "");
  try {
    const decoded = atob(normalized);
    // Round-trip also rejects noncanonical trailing pad bits.
    return decoded.length === 32 && btoa(decoded).replace(/=$/, "") === normalized ? "base64" : null;
  } catch { return null; }
}

export function addressParts(text: string): {text: string; encoding?: AddressEncoding}[] {
  const parts: {text: string; encoding?: AddressEncoding}[] = [];
  let end = 0;
  for (const match of text.matchAll(/[A-Za-z0-9+/_=-]+/g)) {
    const encoding = addressEncoding(match[0]);
    if (!encoding) continue;
    if (match.index > end) parts.push({text: text.slice(end, match.index)});
    parts.push({text: match[0], encoding});
    end = match.index + match[0].length;
  }
  if (end < text.length) parts.push({text: text.slice(end)});
  return parts;
}

export async function copyAddress(value: string, clipboard: Pick<Clipboard, "writeText"> | undefined = globalThis.navigator?.clipboard): Promise<void> {
  if (!addressEncoding(value)) throw new Error("Not a recognized address encoding.");
  if (!clipboard?.writeText) throw new Error("Clipboard is unavailable.");
  await clipboard.writeText(value);
}
