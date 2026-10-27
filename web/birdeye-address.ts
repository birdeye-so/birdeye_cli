import {addressEncoding} from "./address-detection.js";

export type AddressKind = "token" | "wallet";

/** Classify the API subject, not every address returned by that API. */
export function operationSubject(operation?: string): AddressKind | undefined {
  if (operation?.startsWith("portfolio.")) return "wallet";
  if (operation?.startsWith("token.") || operation === "market.ohlcv") return "token";
}

/** Metric rows can describe a different entity from the API request subject. */
export function metricAddressKind(field: string, operation?: string): AddressKind | undefined {
  if (field === "wallet") return "wallet";
  if (field === "token" || field === "tokenFilter") return "token";
  if (field !== "address") return;
  if (["portfolio.holdings", "market.token-list", "market.trending", "market.smart-money"].includes(operation ?? "")) return "token";
  return operationSubject(operation);
}

export function birdeyeAddressUrl(address: string, kind: AddressKind, chain: string): string | undefined {
  const network = chain.trim().toLowerCase();
  if (!/^[a-z][a-z0-9-]*$/.test(network)) return;
  const encoding = addressEncoding(address);
  if (!encoding) return;
  let canonical = address;
  if (encoding === "base64") {
    // Solana URLs use base58. Copy still preserves the original encoding.
    if (network !== "solana") return;
    const bytes = Array.from(atob(address.replaceAll("-", "+").replaceAll("_", "/")), c => c.charCodeAt(0));
    let value = bytes.reduce((n, byte) => n * 256n + BigInt(byte), 0n);
    canonical = "";
    const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    while (value > 0n) { canonical = alphabet[Number(value % 58n)] + canonical; value /= 58n; }
    for (const byte of bytes) { if (byte !== 0) break; canonical = "1" + canonical; }
  }
  return `https://birdeye.so/${network}/${kind === "wallet" ? "wallet-analyzer" : "token"}/${encodeURIComponent(canonical)}`;
}
