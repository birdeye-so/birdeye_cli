import BigNumber from "bignumber.js";
export type DemoRow = Record<string, any>;
export function amount(value: unknown): BigNumber | null {
  if ((typeof value !== "number" && typeof value !== "string") || value === "" || (typeof value === "string" && !value.trim())) return null;
  const n = new BigNumber(value); return n.isFinite() ? n : null;
}
export function money(value: unknown, compact = false): string {
  const n = amount(value); if (!n) return "Unavailable";
  const sign = n.isNegative() && !n.isZero() ? "−" : "";
  const a = n.abs();
  if (compact) for (const [scale, suffix] of [[1e12,"T"],[1e9,"B"],[1e6,"M"],[1e3,"K"]] as const) {
    if (a.gte(scale)) return `${sign}$${a.div(scale).toFormat(2)}${suffix}`;
  }
  return `${sign}$${a.isZero() || a.gte(.01) ? a.toFormat(2) : a.precision(4).toFixed()}`;
}
export function percent(value: unknown, signed = false): string {
  const n = amount(value); if (!n) return "Unavailable";
  return `${signed && n.gt(0) ? "+" : ""}${n.toFormat(2)}%`;
}
export function tone(value: unknown) {const n=amount(value); return !n || n.isZero() ? "" : n.gt(0) ? "positive" : "negative";}
/** Visual ratios only; displayed/exported amounts retain their original decimal precision. */
export function ratio(value: unknown, max: unknown): number {
  const n=amount(value),d=amount(max); return n && d && d.gt(0) ? Math.max(0,Math.min(100,n.div(d).times(100).toNumber())) : 0;
}
export function largest(rows: DemoRow[], field: string): string {
  return rows.reduce<BigNumber>((max,n)=>{const v=amount(n[field]);return v && v.abs().gt(max)?v.abs():max;},new BigNumber(0)).toString();
}
export function sorted(rows: DemoRow[], field: string): DemoRow[] {
  return [...rows].sort((a,b)=>{const x=amount(a[field]),y=amount(b[field]);return !x?(!y?0:1):!y?-1:(y.comparedTo(x)??0);});
}
export function sectionRows(report: DemoRow | undefined, prefix: string): DemoRow[] {
  return report?.sections?.find((section:DemoRow)=>section.title.startsWith(prefix))?.rows || [];
}
export function observedAt(value: unknown): string {
  if (typeof value!=="string" && typeof value!=="number") return "Time unavailable";
  // API observations can carry Unix seconds; retrievedAt uses ISO timestamps.
  const numeric=typeof value==="number"?value:/^\d+(?:\.\d+)?$/.test(value)?Number(value):null;
  const date=new Date(numeric===null?value:Math.abs(numeric)<1e11?numeric*1000:numeric);
  return Number.isNaN(date.getTime()) ? "Time unavailable" : date.toLocaleString();
}
