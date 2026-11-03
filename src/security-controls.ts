import type {Result} from "./runner.js";
import {address} from "./schemas.js";
import {object} from "./shared.js";

/** Shared provider observations; Solana null authorities are distinct from missing fields. */
export function securityControls(source?: Result) {
  const data = object(source?.data);
  const solana = source?.meta.chain === "solana";
  const control = (flags: string[], authority: "ownerAddress" | "freezeAuthority"): {value: boolean | null; basis: string} => {
    for (const flag of flags) {
      if (typeof data[flag] === "boolean") return {value: data[flag], basis: `${flag}: explicit provider boolean`};
    }
    // Birdeye Security Data Glossary: ownerAddress is Solana's mint authority;
    // null revokes mint/freeze; the all-ones freeze authority also disables freeze.
    const basis = `Solana ${authority}: null${authority === "freezeAuthority" ? " or all-ones address" : ""} means inactive; valid address means active; missing or malformed remains unknown`;
    if (!solana || !Object.hasOwn(data, authority)) return {value: null, basis};
    const value = data[authority];
    if (value === null || (authority === "freezeAuthority" && value === "11111111111111111111111111111111")) return {value: false, basis};
    return {value: address.safeParse(value).success ? true : null, basis};
  };
  return {mint: control(["mintable", "isMintable"], "ownerAddress"), freeze: control(["freezeable"], "freezeAuthority")};
}
