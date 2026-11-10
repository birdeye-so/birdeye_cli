import { isIP } from "node:net";
import type { IncomingMessage } from "node:http";

function address(value: string) {
  const normalized = value.trim().replace(/^::ffff:(?=\d+\.)/, "");
  return isIP(normalized) ? normalized : undefined;
}

// Proxy trust is opt-in and limited to exact peer IPs. Walk from the socket
// toward the client so an attacker-supplied prefix cannot replace their IP.
export function clientIdentity(
  req: IncomingMessage,
  trustedProxies: Set<string>,
) {
  let peer = address(req.socket.remoteAddress || "") || "unknown";
  if (!trustedProxies.has(peer)) return peer;
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded !== "string") return peer;
  const hops = forwarded.split(",").map(address);
  if (hops.some((hop) => !hop)) return peer;
  for (const hop of hops.reverse()) {
    if (!trustedProxies.has(peer)) break;
    peer = hop!;
  }
  return peer;
}

export function proxyAddresses(values: string[]) {
  return new Set(
    values.map((value) => {
      const parsed = address(value);
      if (!parsed)
        throw new Error(
          "SKILL_API_TRUSTED_PROXIES must contain exact proxy IP addresses.",
        );
      return parsed;
    }),
  );
}

export class WriteLimiter {
  private clients = new Map<string, { count: number; reset: number }>();
  constructor(
    private limit = 60,
    private windowMs = 60_000,
    private capacity = 10_000,
  ) {}
  take(client: string, now = Date.now()): number {
    let entry = this.clients.get(client);
    if (entry && entry.reset <= now) {
      this.clients.delete(client);
      entry = undefined;
    }
    if (!entry) {
      if (this.clients.size >= this.capacity) {
        for (const [key, value] of this.clients)
          if (value.reset <= now) this.clients.delete(key);
        if (this.clients.size >= this.capacity)
          return Math.ceil(this.windowMs / 1000);
      }
      entry = { count: 0, reset: now + this.windowMs };
      this.clients.set(client, entry);
    }
    if (entry.count >= this.limit)
      return Math.max(1, Math.ceil((entry.reset - now) / 1000));
    entry.count++;
    return 0;
  }
}
