import React from "react";
export { SkillDashboard as SkillFindings } from "./skill-visuals";
type Data = Record<string, any>;
export function SkillSettings({
  kind,
  value,
  change,
  limit,
  setLimit,
  scanLimit,
  setScanLimit,
  interval,
  setInterval,
  duration,
  setDuration,
}: {
  kind: string;
  value: Data;
  change: (value: Data) => void;
  limit: number;
  setLimit: (v: number) => void;
  scanLimit: number;
  setScanLimit: (v: number) => void;
  interval: string;
  setInterval: (v: string) => void;
  duration: string;
  setDuration: (v: string) => void;
}) {
  const patch = (key: string, v: unknown) =>
    change(
      key === "listSource"
        ? { ...value, [key]: v, platform: undefined, sortBy: "volume" }
        : key === "stage" && v === "newly-listed"
          ? { ...value, stage: v, source: "all", minLiquidity: undefined }
          : { ...value, [key]: v },
    );
  const select = (
    key: string,
    label: string,
    choices: string[],
    fallback: string,
  ) => (
    <label key={key}>
      {label}
      <select
        value={value[key] ?? fallback}
        onChange={(e) => patch(key, e.target.value)}
      >
        {choices.map((v) => (
          <option key={v}>{v}</option>
        ))}
      </select>
    </label>
  );
  const check = (key: string, label: string) => (
    <label className="check" key={key}>
      <input
        type="checkbox"
        checked={value[key] ?? false}
        onChange={(e) => patch(key, e.target.checked)}
      />
      {label}
    </label>
  );
  const wallet =
    kind.includes("wallet") ||
    kind === "skill-smart-money-profile" ||
    kind === "skill-smart-money-leaderboard";
  const dataDepth = [
    "skill-launchpad-trending",
    "skill-top-holder-analysis",
    "skill-lp-analysis",
    "skill-smart-money-holders",
    "skill-kol-signal",
  ].includes(kind);
  const timeline =
    kind === "skill-kol-signal" ||
    (kind === "skill-smart-money-holders" && value.depth === "full");
  const numericInput = (
    key: string,
    label: string,
    min: number,
    max?: number,
    fallback?: number,
  ) => (
    <label key={key}>
      {label}
      <input
        type="number"
        min={min}
        max={max}
        value={value[key] ?? fallback ?? ""}
        onChange={(e) =>
          patch(key, e.target.value === "" ? undefined : Number(e.target.value))
        }
      />
    </label>
  );
  return (
    <div
      className={`skill-settings${kind === "skill-token-dd-score" ? " token-dd-settings" : ""}`}
    >
      <div className="form-grid workflow-options">
        {dataDepth &&
          select("depth", "Evidence depth", ["core", "full"], "core")}
        {kind === "skill-launchpad-trending" && (
          <>
            {value.stage !== "newly-listed" &&
              select(
                "source",
                "Launchpad",
                [
                  "all",
                  "pump_dot_fun",
                  "moonshot",
                  "raydium_launchlab",
                  "meteora_dynamic_bonding_curve",
                ],
                "all",
              )}
            {select(
              "stage",
              "Launch stage",
              ["newly-created", "near-graduation", "graduated", "newly-listed"],
              "newly-created",
            )}
            {value.stage !== "newly-listed" &&
              select(
                "launchSort",
                "Rank launch tokens by",
                [
                  "volume_24h_usd",
                  "liquidity",
                  "market_cap",
                  "creation_time",
                  "graduated_time",
                  "progress_percent",
                ],
                "volume_24h_usd",
              )}
            {value.stage === "near-graduation" &&
              numericInput("minProgress", "Minimum launch progress · %", 1, 99)}
            {value.stage !== "newly-listed" &&
              numericInput("minLiquidity", "Minimum liquidity · USD", 0)}
          </>
        )}
        {kind === "skill-token-stats" && (
          <label>
            Rolling activity windows
            <input
              value={(value.statsFrames ?? ["1h", "24h"]).join(",")}
              onChange={(e) =>
                patch(
                  "statsFrames",
                  e.target.value.split(",").map((v) => v.trim()),
                )
              }
            />
            <small className="field-hint">
              Comma-separated: 1m, 5m, 30m, 1h, 2h, 4h, 8h, 24h.
            </small>
          </label>
        )}
        {kind === "skill-top-holder-analysis" &&
          numericInput("topN", "Top holder wallets", 10, 50, 50)}
        {kind === "skill-top-trader-analysis" && (
          <>
            {select(
              "traderWindow",
              "Trader window",
              [
                "30m",
                "1h",
                "2h",
                "4h",
                "6h",
                "8h",
                "12h",
                "24h",
                "2d",
                "3d",
                "7d",
                "14d",
                "30d",
                "60d",
                "90d",
                "all_time",
              ],
              "24h",
            )}
            {select(
              "traderSort",
              "Rank traders by",
              [
                "volume_usd",
                "trade",
                "total_pnl",
                "realized_pnl",
                "unrealized_pnl",
                "hold_volume",
              ],
              "volume_usd",
            )}
          </>
        )}
        {([
          "skill-launchpad-trending",
          "skill-top-trader-analysis",
          "skill-lp-analysis",
          "skill-smart-money-holders",
        ].includes(kind) ||
          (kind === "skill-kol-signal" && value.depth === "full")) && (
          <label>
            {kind === "skill-kol-signal"
              ? "Maximum wallets per detail bucket"
              : "Maximum page rows"}
            <input
              type="number"
              min="1"
              max={
                kind === "skill-top-trader-analysis"
                  ? 10
                  : kind === "skill-lp-analysis"
                    ? 20
                    : 50
              }
              value={scanLimit}
              onChange={(e) => setScanLimit(Number(e.target.value))}
            />
          </label>
        )}
        {(kind === "skill-lp-analysis" ||
          (kind === "skill-launchpad-trending" && value.depth === "full")) && (
          <label>
            Maximum detail lookups
            <input
              type="number"
              min="1"
              max="5"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            />
          </label>
        )}
        {kind === "skill-smart-money-holders" &&
          check("includeExited", "Include wallets with zero current balance")}
        {timeline &&
          select(
            "trackerFrame",
            "Activity bucket",
            ["1m", "5m", "15m", "30m", "1h", "4h", "1D"],
            "1h",
          )}
        {kind === "skill-kol-signal" &&
          numericInput(
            "signalThresholdUsd",
            "Net-flow threshold · USD",
            0,
            undefined,
            0,
          )}
        {(timeline ||
          kind === "skill-launchpad-trending" ||
          (kind === "skill-lp-analysis" && value.depth === "full")) && (
          <>
            {numericInput("from", "Window start · Unix seconds", 1)}
            {numericInput("to", "Window end · Unix seconds", 1)}
            <p className="field-hint">
              Set both timestamps, or leave both empty for the last day. Reports
              cover the returned sample.
            </p>
          </>
        )}
        {kind === "skill-token-dd-score" && (
          <>
            <fieldset className="dd-mode-picker">
              <legend className="visually-hidden">Evidence depth</legend>
              <div>
                {[
                  [
                    "standard",
                    "Standard",
                    "Overview & security",
                    "2 calls · ~51 CU",
                  ],
                  [
                    "advanced",
                    "Advanced",
                    "Holders, flows & liquidity",
                    "7 calls · ~181 CU",
                  ],
                ].map(([mode, title, description, cost]) => (
                  <label
                    key={mode}
                    className={
                      (value.ddMode ?? "advanced") === mode ? "selected" : ""
                    }
                  >
                    <input
                      type="radio"
                      name="dd-evidence-depth"
                      value={mode}
                      checked={(value.ddMode ?? "advanced") === mode}
                      onChange={() => patch("ddMode", mode)}
                    />
                    <span>
                      <strong>{title}</strong>
                      <small>{description}</small>
                    </span>
                    <em>{cost}</em>
                  </label>
                ))}
              </div>
            </fieldset>
            {(value.ddMode ?? "advanced") === "advanced" && (
              <>
                <label>
                  Top holder rows
                  <input
                    type="number"
                    min="10"
                    max="50"
                    value={value.topN ?? 50}
                    onChange={(e) => patch("topN", Number(e.target.value))}
                  />
                </label>
                {select(
                  "liqResolution",
                  "Liquidity candle resolution",
                  ["1m", "5m", "15m", "30m", "1h", "4h", "1D"],
                  "15m",
                )}
                <label>
                  Liquidity candles
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={value.liqCandles ?? 96}
                    onChange={(e) =>
                      patch("liqCandles", Number(e.target.value))
                    }
                  />
                </label>
              </>
            )}
            <p className="field-hint">
              Advanced CU includes a provisional OHLC estimate. Scores across
              modes have different coverage.
            </p>
          </>
        )}
        {kind === "skill-trending-list" && (
          <>
            {select(
              "listSource",
              "Discovery source",
              ["v3-list", "trending"],
              "v3-list",
            )}
            {select(
              "sortBy",
              "Rank tokens by",
              value.listSource === "trending"
                ? ["volume", "liquidity", "rank"]
                : [
                    "volume",
                    "liquidity",
                    "market_cap",
                    "holder",
                    "trade_count",
                  ],
              "volume",
            )}
            <label>
              Activity window
              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
              >
                {["1h", "4h", "24h"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            {value.listSource !== "trending" && (
              <label>
                Platform name (optional)
                <input
                  value={value.platform ?? ""}
                  placeholder="pump.fun"
                  onChange={(e) =>
                    patch("platform", e.target.value || undefined)
                  }
                />
              </label>
            )}
          </>
        )}
        {["skill-trending-list", "skill-smart-wallets"].includes(kind) && (
          <label>
            Discovery rows
            <input
              type="number"
              min="1"
              max={kind === "skill-smart-wallets" ? 20 : 50}
              value={scanLimit}
              onChange={(e) => setScanLimit(Number(e.target.value))}
            />
            {kind === "skill-smart-wallets" && (
              <small className="field-hint">
                Smart-money API allows at most 20 tokens per page.
              </small>
            )}
          </label>
        )}
        {kind === "skill-smart-wallets" && (
          <>
            {select(
              "skillDepth",
              "Wallet research depth",
              ["fast", "standard", "deep"],
              "fast",
            )}
            <label>
              Maximum tokens / wallets
              <input
                type="number"
                min="1"
                max="5"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
              />
            </label>
          </>
        )}
        {["skill-kline-pattern", "skill-contract-dd"].includes(kind) &&
          select(
            "resolution",
            "Candle resolution",
            ["1m", "5m", "15m", "30m", "1H", "4H", "1D"],
            "15m",
          )}
        {[
          "skill-kline-pattern",
          "skill-contract-dd",
          "skill-rugcheck-audit",
          "skill-token-dd",
        ].includes(kind) && (
          <label>
            Observation window · days
            <input
              type="number"
              min="1"
              max="30"
              value={value.windowDays ?? 7}
              onChange={(e) => patch("windowDays", Number(e.target.value))}
            />
          </label>
        )}
        {wallet &&
          kind !== "skill-smart-wallets" &&
          select("pnlMethod", "PnL accounting", ["wac", "net_cash"], "wac")}
        {kind === "skill-wallet-style" && (
          <label>
            Style period
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option>7d</option>
              <option>30d</option>
            </select>
          </label>
        )}
        {kind === "skill-wallet-analysis" && (
          <label>
            PnL periods
            <input
              value={(
                value.intervals ?? ["24h", "7d", "30d", "90d", "all"]
              ).join(",")}
              onChange={(e) =>
                patch(
                  "intervals",
                  e.target.value.split(",").map((s) => s.trim()),
                )
              }
            />
            <small className="field-hint">
              Comma-separated: 24h, 7d, 30d, 90d, all. Each period is a request.
            </small>
          </label>
        )}
      </div>
      <div className="skill-toggles">
        {kind === "skill-token-dd" &&
          ["list", "advanced_security", "risk_history"].map((v, i) => (
            <label className="check" key={v}>
              <input
                type="checkbox"
                checked={(value.include ?? []).includes(v)}
                onChange={(e) =>
                  patch(
                    "include",
                    e.target.checked
                      ? [...(value.include ?? []), v]
                      : (value.include ?? []).filter(
                          (item: string) => item !== v,
                        ),
                  )
                }
              />
              {
                [
                  "Add holder list",
                  "Add labeled holder groups",
                  "Add historical liquidity",
                ][i]
              }
            </label>
          ))}
        {kind === "skill-contract-dd" &&
          check("skipKline", "Skip price candles")}
        {[
          "skill-wallet-score",
          "skill-wallet-style",
          "skill-wallet-analysis",
          "skill-smart-money-profile",
        ].includes(kind) &&
          check("skipFirstFunded", "Skip first funding lookup")}
        {[
          "skill-wallet-style",
          "skill-wallet-analysis",
          "skill-smart-money-profile",
        ].includes(kind) &&
          check("skipTransactions", "Skip transaction / trade page")}
        {[
          "skill-wallet-score",
          "skill-wallet-analysis",
          "skill-smart-money-profile",
        ].includes(kind) && check("skipPortfolio", "Skip holdings")}
        {kind === "skill-wallet-score" &&
          check("skipPositions", "Skip positions (alpha score unavailable)")}
      </div>
    </div>
  );
}
