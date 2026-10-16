import { z } from "zod";

export const address = z
  .string()
  .regex(
    /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    "Use a Solana address, not a token symbol.",
  )
  .refine((value) => {
    let n = 0n;
    const alphabet =
      "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    for (const c of value) n = n * 58n + BigInt(alphabet.indexOf(c));
    let bytes = 0;
    while (n > 0n) {
      bytes++;
      n >>= 8n;
    }
    return bytes + (value.match(/^1*/)?.[0].length ?? 0) === 32;
  }, "Solana addresses must decode to 32 bytes.");
export const timestamp = z.number().int().min(1).max(10_000_000_000);
export const amount = z.number().finite().min(0);
export const direction = z.enum(["asc", "desc"]);
export const holderTags = ["bundler", "sniper", "insider", "dev", "smart_trader", "kol"] as const;
export const trackerTags = ["dev", "sniper", "smart_trader", "kol"] as const;
export const flowFrames = ["1m", "5m", "30m", "1h", "2h", "4h", "8h", "24h"] as const;
export const duration = z.enum(["24h", "7d", "30d", "90d", "all"]);
export const pnlFields = {
  wallet: address,
  duration: duration.default("30d"),
  position_scope: z.enum(["duration_only", "cumulative"]).default("duration_only"),
  pnl_method: z.enum(["wac", "net_cash"]).default("wac"),
};
export const page = (max: number, fallback = max) => ({
  limit: z.number().int().min(1).max(max).default(fallback),
  offset: z.number().int().min(0).max(10000).default(0),
});
export const validPage = (p: {offset: number; limit: number}) => p.offset + p.limit <= 10000;
