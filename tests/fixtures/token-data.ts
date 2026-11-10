export const dataSkillIds = ["skill-launchpad-trending", "skill-token-security", "skill-token-stats", "skill-top-holder-analysis", "skill-top-trader-analysis", "skill-lp-analysis", "skill-smart-money-holders", "skill-kol-signal"];
export const token = "So11111111111111111111111111111111111111112", wallet = "11111111111111111111111111111112", pool = "11111111111111111111111111111113", at = 1791504000;
// Synthetic values use the nesting and units in Birdeye's public response schemas.
export function tokenDataFixture(url: URL): Response {
  let data: unknown;
  switch (url.pathname) {
    case "/defi/v3/token/meme/list": data = {items: [{address: token, symbol: "TEST", liquidity: 5000, volume_24h_usd: 1200, meme_info: {source: "pump_dot_fun", creation_time: at-3600, graduated: false, progress_percent: 85}}]}; break;
    case "/defi/v3/token/meme/detail/single": data = {meme_info: {source: "pump_dot_fun", creator: wallet, pool, progress_percent: 85}}; break;
    case "/defi/v2/tokens/new_listing": data = {items: [{address: token, liquidityAddedAt: at-60}, {address: pool, liquidityAddedAt: at-90000}, {address: wallet}]}; break;
    case "/defi/token_security": data = {ownerAddress: null, freezeAuthority: null, mutableMetadata: false, nonTransferable: false, transferFeeEnable: false, creatorPercentage: .02, top10HolderPercent: .3}; break;
    case "/defi/token_overview": data = {price: .01, marketCap: 1000, fdv: 1200, liquidity: 500, holder: 20}; break;
    case "/defi/v3/token/trade-data/single": data = {price_change_1h_percent: -2, volume_1h_usd: 0, volume_buy_1h_usd: 0, volume_sell_1h_usd: 0, trade_1h: 0, unique_wallet_1h: 0, volume_24h_usd: 100, trade_24h: 5}; break;
    case "/holder/v1/distribution": data = {summary: {percent_of_supply: 90}, holders: Array.from({length: 10}, (_, i) => ({wallet: wallet+String(i), holding: "100000000000000000001", percent_of_supply: 2}))}; break;
    case "/token/v1/holder-profile": data = {token: {}, holder_summary: {}, tags: [{tag: "smart_trader", holder_count: 7, percent_of_supply: 12}]}; break;
    case "/defi/v2/tokens/top_traders": data = {items: [{owner: wallet, volumeBuyUSD: 100, volumeSellUSD: 80, volumeUsd: 180, tradeBuy: 2, tradeSell: 1, realizedPnl: -4, holdVolumeUsd: 30}]}; break;
    case "/defi/v2/markets": data = {total: 4, items: [{address: pool, source: "Raydium", liquidity: 80, volume24h: 100}, {address: wallet, source: "Orca", liquidity: 20, volume24h: 50}]}; break;
    case "/defi/v3/pair/overview/single": data = {liquidity: 80, volume_24h: 100, trade_24h: 3}; break;
    case "/defi/v3/liquidity/history/token": data = {items: [{unix_time: at-14400, liquidity_usd: "1000"}, {unix_time: at, liquidity_usd: "500"}]}; break;
    case "/token/v1/holder-positions": data = [{wallet_address: wallet, hold_amount: "3", percent_of_supply: 2, pnl: -3, buy_volume_usd: 100, sell_volume_usd: 60}, {wallet_address: pool, hold_amount: "0"}]; break;
    case "/token/v1/wallet-tags-tracker": data = {groups: {tags: {[url.searchParams.get("tags")!]: [{unix_time: at-3600, volume_buy_usd: 100, volume_sell_usd: 40}, {unix_time: at, volume_buy_usd: 0, volume_sell_usd: 10}]}}, has_more: true, next_time_from: at+1}; break;
    case "/token/v1/wallet-tags-tracker/details": data = {items: [at-3600, at].map(unix_time => ({unix_time, wallets: [{wallet, tags: [url.searchParams.get("tags")!], volume_buy_usd: 100, volume_sell_usd: 40, tx_buy_count: 2, tx_sell_count: 1}]})), has_more: true}; break;
    default: throw new Error(`Unexpected token-data request ${url.pathname}`);
  }
  return Response.json({success: true, data});
}
