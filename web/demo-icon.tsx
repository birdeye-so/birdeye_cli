import React from "react";

const paths: Record<string, string> = {
  terminal: "M3 4h18v16H3z M3 9h18 M9 9v11",
  "dex-inspector": "M4 8h15m-4-4 4 4-4 4 M20 16H5m4-4-4 4 4",
  "wallet-intelligence": "M3 6h18v14H3z M3 6l14-3v3 M16 11h5v5h-5z",
  "security-signals": "m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z M12 8v5 M12 16v1",
  "telegram-brief": "m3 10 18-7-6 18-4-7-8-4Z M11 14l10-11",
};
export const demoLabels: Record<string, string> = {
  terminal: "Market", "dex-inspector": "Token & pools", "wallet-intelligence": "Wallets",
  "security-signals": "Security", "telegram-brief": "Telegram",
};
export function DemoIcon({id, size = 20}: {id: string; size?: number}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[id] || paths.terminal}/></svg>;
}
