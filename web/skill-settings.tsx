import React from "react";
import { surgeChains, surgeIntervals } from "../src/price-surge/schema";
export { SkillDashboard as SkillFindings } from "./skill-visuals";
type Data = Record<string, any>;
// Renders the typed text, so a field can be emptied and "20" never shows as "020".
export function NumberInput({
  value,
  onValue,
  ...props
}: Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  value: number | undefined;
  onValue: (value: number | undefined) => void;
}) {
  const [draft, setDraft] = React.useState<{ text: string; value?: number }>({
    text: "",
  });
  return (
    <input
      type="number"
      {...props}
      value={draft.value === value ? draft.text : (value ?? "")}
      onChange={(e) => {
        const text = e.target.value,
          next = text === "" ? undefined : Number(text);
        setDraft({ text, value: next });
        onValue(next);
      }}
    />
  );
}
// Per-skill page-row caps; the shared scanLimit state must start within them.
export const scanLimitMax = (kind: string) =>
  kind === "skill-top-trader-analysis"
    ? 10
    : ["skill-lp-analysis", "skill-smart-wallets"].includes(kind)
      ? 20
      : 50;
export const defaultScanLimit = (kind: string) =>
  Math.min(kind.startsWith("skill-") ? 20 : 50, scanLimitMax(kind));
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
  limit: number | undefined;
  setLimit: (v: number | undefined) => void;
  scanLimit: number | undefined;
  setScanLimit: (v: number | undefined) => void;
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
    step?: "any",
  ) => (
    <label key={key}>
      {label}
      <NumberInput
        min={min}
        max={max}
        step={step}
        placeholder={fallback === undefined ? undefined : String(fallback)}
        // A cleared field keeps its key as undefined and falls back on the server, not on screen.
        value={Object.hasOwn(value, key) ? value[key] : fallback}
        onValue={(v) => patch(key, v)}
      />
    </label>
  );
  // Price Surge reads its filters from input.priceSurge, not top-level options.
  const surge = value.priceSurge ?? {};
  const setSurge = (key: string, v: unknown) =>
    change({ ...value, priceSurge: { ...surge, [key]: v } });
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
              numericInput(
                "minLiquidity",
                "Minimum liquidity · USD",
                0,
                undefined,
                undefined,
                "any",
              )}
          </>
        )}
        {kind === "skill-price-surge" && (
          <>
            {(
              [
                ["chain", "Chain", surgeChains, "solana"],
                ["interval", "Surge interval", surgeIntervals, "1h"],
              ] as const
            ).map(([key, label, choices, fallback]) => (
              <label key={key}>
                {label}
                <select
                  value={surge[key] ?? fallback}
                  onChange={(e) => setSurge(key, e.target.value)}
                >
                  {choices.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
            ))}
            {(
              [
                ["min_market_cap", "Minimum market cap · USD"],
                ["max_market_cap", "Maximum market cap · USD"],
              ] as const
            ).map(([key, label]) => (
              <label key={key}>
                {label}
                <NumberInput
                  min="0"
                  step="any"
                  value={surge[key]}
                  onValue={(v) => setSurge(key, v)}
                />
              </label>
            ))}
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
            <NumberInput
              min="1"
              max={scanLimitMax(kind)}
              placeholder={String(defaultScanLimit(kind))}
              value={scanLimit}
              onValue={setScanLimit}
            />
          </label>
        )}
        {(kind === "skill-lp-analysis" ||
          (kind === "skill-launchpad-trending" && value.depth === "full")) && (
          <label>
            Maximum detail lookups
            <NumberInput
              min="1"
              max="5"
              placeholder="3"
              value={limit}
              onValue={setLimit}
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
            "any",
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
                {numericInput("topN", "Top holder rows", 10, 50, 50)}
                {select(
                  "liqResolution",
                  "Liquidity candle resolution",
                  ["1m", "5m", "15m", "30m", "1h", "4h", "1D"],
                  "15m",
                )}
                {numericInput("liqCandles", "Liquidity candles", 1, 100, 96)}
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
            <NumberInput
              min="1"
              max={scanLimitMax(kind)}
              placeholder={String(defaultScanLimit(kind))}
              value={scanLimit}
              onValue={setScanLimit}
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
              <NumberInput
                min="1"
                max="5"
                placeholder="3"
                value={limit}
                onValue={setLimit}
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
        ].includes(kind) &&
          numericInput("windowDays", "Observation window · days", 1, 30, 7)}
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
