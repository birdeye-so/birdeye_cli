// Lucide icons served by Iconify's public SVG API.
const icons: Record<string, string> = {
  "skill-launchpad-trending": "rocket",
  "skill-token-security": "shield-alert",
  "skill-token-stats": "chart-column",
  "skill-top-holder-analysis": "users",
  "skill-top-trader-analysis": "medal",
  "skill-lp-analysis": "droplets",
  "skill-smart-money-holders": "wallet",
  "skill-kol-signal": "radio",
  "skill-price-surge": "trending-up",
  "skill-token-dd-score": "clipboard-check",
  "skill-trending-list": "flame",
  "skill-smart-wallets": "wallet-cards",
  "skill-contract-dd": "shield-check",
  "skill-rugcheck-audit": "scan-search",
  "skill-kline-pattern": "chart-candlestick",
  "skill-wallet-score": "badge-check",
  "skill-wallet-style": "sliders-horizontal",
  "skill-wallet-analysis": "chart-no-axes-combined",
  "skill-smart-money-profile": "user-search",
  "skill-smart-money-leaderboard": "trophy",
};
// The demo UI (web/skill-icon.tsx) inlines the same Lucide names.
export function skillIconName(id: string) {
  return Object.hasOwn(icons, id) ? icons[id] : "file-text";
}
export function skillIconUrl(id: string) {
  return `https://api.iconify.design/lucide/${skillIconName(id)}.svg?color=%2300ffa3`;
}
