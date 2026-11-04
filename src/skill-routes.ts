// Shared by the demo host and UI so accepted URLs select the same skill.
export function skillForPath<T extends {kind: string; family: string}>(pathname: string, cases: readonly T[]): T | undefined {
  const match = /^\/([a-z0-9][a-z0-9-]*)\/?$/.exec(pathname);
  if (!match) return;
  const aliases: Record<string, string> = {
    "price-surge-screen": "skill-price-surge",
    "prige-surge-screen": "skill-price-surge",
  };
  const slug = match[1];
  const kind = aliases[slug] ?? (slug.startsWith("skill-") ? slug : `skill-${slug}`);
  return cases.find(item => item.family === "data-skills" && item.kind === kind);
}
