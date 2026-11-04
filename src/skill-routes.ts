import {resolveSkillId} from "./skill-identity.js";
// Shared by the demo host and UI so accepted URLs select the same skill.
export function skillForPath<T extends {kind: string; family: string}>(pathname: string, cases: readonly T[]): T | undefined {
  const match = /^\/([a-z0-9][a-z0-9-]*)\/?$/.exec(pathname);
  if (!match) return;
  const skills = cases.filter(item => item.family === "data-skills");
  const kind = resolveSkillId(match[1], skills.map(item => item.kind));
  return skills.find(item => item.kind === kind);
}
