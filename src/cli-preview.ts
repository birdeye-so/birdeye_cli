// Browser-safe serialization: only supported flags, never credentials or incidental UI fields.
type Input = Record<string, unknown>;
const caseFlags = [
  "address", "limit", "scanLimit", "interval", "depth", "duration", "pnlMethod",
  "from", "to", "stage", "source", "minProgress", "minLiquidity", "maxTop10Pct",
  "excludeFreezeable", "baselineLiquidity", "baselineTime", "wallets", "intervals",
  "skillDepth", "listSource", "sortBy", "platform", "resolution", "windowDays",
  "include", "skipKline", "skipPortfolio", "skipFirstFunded", "skipTransactions",
  "skipPositions", "stepOverrides",
];
function flags(input: Input, names: string[]): string[] {
  return names.flatMap(name => {
    const value = input[name];
    if (value === undefined || value === null || value === false || value === "") return [];
    const flag = `--${name.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}`;
    if (value === true) return [flag];
    if (Array.isArray(value)) return value.length ? [flag, value.join(",")] : [];
    if (typeof value === "object") return Object.keys(value).length ? [flag, JSON.stringify(value)] : [];
    return [flag, String(value)];
  });
}
const outputFlags = (budget: number) => ["--chain", "solana", "--max-cu", String(budget), "--format", "json"];
export function caseCliArgs(input: Input, budget: number): string[] {
  return ["case", String(input.kind), ...flags(input, caseFlags), ...outputFlags(budget)];
}
export function demoCliArgs(input: Input, budget: number): string[] {
  return ["demo", String(input.id), ...flags(input, ["address", "limit", "from", "to",
    ...(input.id === "security-signals" ? ["minLiquidity", "maxTop10Pct"] : [])]), ...outputFlags(budget)];
}
export function importedCliArgs(id: string, input: Input, budget: number): string[] {
  const params = Object.fromEntries(["from", "to", "limit", "stepOverrides"]
    .filter(key => input[key] !== undefined).map(key => [key, input[key]]));
  return ["workflow", "imports", "run", id, ...flags(input, ["address"]),
    "--params", JSON.stringify(params), ...outputFlags(budget)];
}
/** POSIX shell quoting for bash/zsh, including JSON and embedded single quotes. */
export function shellCommand(args: string[]): string {
  return ["birdeye-cli", ...args].map(value => /^[a-zA-Z0-9_.,:/=-]+$/.test(value)
    ? value : `'${value.replaceAll("'", "'\"'\"'")}'`).join(" ");
}
