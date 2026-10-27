import type {Profile} from "../../src/config";
export {validateProviderUrl, profileSchema} from "../../src/provider";
export function aiKey(profile: Profile) { return profile.apiKey || ""; }
// Session-local opaque credential IDs: never retain or derive a reversible key in reports.
const identities = new Map<string, string>();
export function credentialId(key: string) {
  if (!identities.has(key)) identities.set(key, crypto.randomUUID());
  return identities.get(key)!;
}
export function clearCredentialIds() { identities.clear(); }
