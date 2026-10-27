// Purpose-specific pictograms authored for this API, on a shared 24 × 24 grid.
const icons: Record<string, string> = {
  'skill-token-dd-score': '<path d="M9 3H5v18h14V3h-4M9 2h6v4H9zM8 11h5M8 15h3"/><circle cx="16" cy="15" r="3"/><path d="m18 17 3 3"/>',
  'skill-trending-list': '<path d="m3 17 6-6 4 4 8-11M15 4h6v6"/>',
  'skill-smart-wallets': '<path d="M13 5H4v15h16v-8M4 9h9M17 2v6M14 5h6M15 14h5v4h-5z"/>',
  'skill-contract-dd': '<path d="m12 2 8 3v6c0 5-8 11-8 11S4 16 4 11V5zM8 11l3 3 5-6"/>',
  'skill-rugcheck-audit': '<path d="M9 2h6M10 2v7L4 19q-1 3 2 3h12q3 0 2-3L14 9V2M7 16h10M10 12h1"/>',
  'skill-kline-pattern': '<path d="M6 3v4m0 8v6M3 7h6v8H3zM17 2v9m0 7v4M14 11h6v7h-6z"/>',
  'skill-wallet-score': '<path d="M3 20h18M5 16V9h3v7M11 16V5h3v11M17 16v-4h3v4"/>',
  'skill-wallet-style': '<path d="M4 5h16M4 12h16M4 19h16"/><circle cx="8" cy="5" r="2" fill="#ffffff"/><circle cx="16" cy="12" r="2" fill="#ffffff"/><circle cx="10" cy="19" r="2" fill="#ffffff"/>',
  'skill-wallet-analysis': '<path d="M3 3v18h18M6 15l4-5 4 3 6-8M16 5h4v4"/>',
  'skill-smart-money-profile': '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2M16 3l2-2M20 7h3"/>',
  'skill-smart-money-leaderboard': '<path d="M8 3h8v6a4 4 0 0 1-8 0zM8 5H4v3a4 4 0 0 0 4 4M16 5h4v3a4 4 0 0 1-4 4M12 13v6M8 21h8M9 19h6"/>',
};
const fallback = '<path d="M5 3h14v18H5zM8 8h8M8 12h8M8 16h5"/>';
export function skillIconUrl(id: string) {
  return `/agent/api/skills/${encodeURIComponent(id)}/icon.svg`;
}
export function skillIconSvg(id: string) {
  const paths = Object.hasOwn(icons, id) ? icons[id] : fallback;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}
