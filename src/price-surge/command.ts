import { Command } from "commander";
import type { Data } from "../shared.js";

export function registerPriceSurge(
  program: Command,
  run: (params: Data, command: Command) => Promise<void>,
) {
  const command = program
    .command("price-surge")
    .description("Screen price surges through the internal Price Surge API");
  command
    .option("--mode <mode>", "standard (50 CU) or advanced", "standard")
    .option("--interval <interval>", "1m,5m,30m,1h,2h,4h,8h,24h,7d,30d", "1h")
    .option(
      "--sort-by <field>",
      "price_change, volume, market_cap, liquidity, trade_count or holder",
    )
    .option("--sort-type <direction>", "desc or asc")
    .option("--platform <name>", "launch platform, e.g. pump.fun")
    .option(
      "--with-security",
      "advanced: add token security (+30 CU per hydrated row)",
    )
    .option("--no-auto-filter", "retain flagged rows and their risk reasons")
    .option("--no-holder-health", "advanced: skip Solana holder profiles");
  for (const [flag, description] of Object.entries({
    "min-price-change": "minimum surge percent (default 50)",
    "min-market-cap": "minimum market cap USD",
    "max-market-cap": "maximum market cap USD",
    "min-liquidity": "minimum liquidity USD (default 10000)",
    "max-liquidity": "maximum liquidity USD",
    "min-volume": "minimum volume USD over interval (default 5000)",
    "min-trade-count": "minimum trades over interval",
    "min-holders": "minimum holders",
    limit: "token-list page size, 1–100 (default 10)",
    offset: "page offset (default 0)",
    top: "maximum first-pass survivors to hydrate, 0–100 (default 10)",
    "max-liq-mcap-ratio":
      "minimum liquidity / market cap despite legacy name (default 0.005)",
    "max-trades-per-wallet": "maximum 24h trades per wallet (default 150)",
    "max-dev-hold-pct": "maximum creator share, percent",
    "max-top10-pct": "maximum top-10 share, percent",
    "min-kol-buyers":
      "minimum tagged buyers in trader sample; unknown tags do not become zero",
  }))
    command.option(`--${flag} <number>`, description, Number);
  command.action(async (values: Data, cmd: Command) => {
    const params = Object.fromEntries(
      Object.entries(values)
        .filter(
          ([key]) => !["format", "autoFilter", "holderHealth"].includes(key),
        )
        .map(([key, value]) => [
          key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`),
          value,
        ]),
    );
    params.no_auto_filter = values.autoFilter === false;
    params.no_holder_health = values.holderHealth === false;
    params.chain = cmd.optsWithGlobals().chain;
    await run(params, cmd);
  });
}
