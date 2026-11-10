import { readFileSync, statSync } from "node:fs";
import type { Result } from "./runner.js";
import { RunStore } from "./run-store.js";
import { AppError } from "./shared.js";
export { attachDdCu, rescoreDd } from "./token-dd-runtime.js";

export function loadDdEvidence(value: string, archive: RunStore): Result {
  if (/^[a-f0-9]{8}-[a-f0-9-]{27}$/i.test(value)) {
    const run = archive.get(value);
    if (!run.result)
      throw new AppError("RESCORE_INVALID", "Saved run has no evidence.");
    return run.result;
  }
  let text: string;
  const max = 32 * 1024 * 1024;
  try {
    if (value.startsWith("base64:")) {
      if (value.length > max * 1.4) throw new Error();
      text = Buffer.from(value.slice(7), "base64").toString("utf8");
    } else {
      if (statSync(value).size > max) throw new Error();
      text = readFileSync(value, "utf8");
    }
    if (Buffer.byteLength(text) > max) throw new Error();
    const parsed = JSON.parse(text);
    return parsed.result ?? parsed;
  } catch {
    throw new AppError(
      "RESCORE_INVALID",
      "Use a saved run ID, full JSON export path, or base64:<encoded JSON> (maximum 32 MiB).",
    );
  }
}
