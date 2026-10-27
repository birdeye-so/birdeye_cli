// Lucide icons served by Iconify's public SVG API.
const icons: Record<string, string> = {
  'skill-token-dd-score': 'clipboard-check',
  'skill-trending-list': 'flame',
  'skill-smart-wallets': 'wallet-cards',
  'skill-contract-dd': 'shield-check',
  'skill-rugcheck-audit': 'scan-search',
  'skill-kline-pattern': 'chart-candlestick',
  'skill-wallet-score': 'badge-check',
  'skill-wallet-style': 'sliders-horizontal',
  'skill-wallet-analysis': 'chart-no-axes-combined',
  'skill-smart-money-profile': 'user-search',
  'skill-smart-money-leaderboard': 'trophy',
};
export function skillIconUrl(id: string) {
  const icon = Object.hasOwn(icons, id) ? icons[id] : 'file-text';
  return `https://api.iconify.design/lucide/${icon}.svg?color=%232563eb`;
}
