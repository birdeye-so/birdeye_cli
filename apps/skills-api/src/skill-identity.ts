// Generated from src/skill-identity.ts by skills-api:sync. Do not edit.
// Canonical identity rules for the UI and API. The standalone API receives a
// generated copy via skills-api:sync so it can build and deploy independently.
export function skillAliases(id: string): string[] {
  const aliases = [id.replace(/^skill-/, "")];
  if (id === "skill-price-surge")
    aliases.push(
      "price-surge-screen",
      "skill-price-surge-screen",
      "prige-surge",
      "skill-prige-surge",
      "prige-surge-screen",
      "skill-prige-surge-screen",
    );
  return aliases.filter((alias) => alias !== id);
}

export function resolveSkillId(
  input: string,
  ids: readonly string[],
): string | undefined {
  if (ids.includes(input)) return input;
  return ids.find((id) => skillAliases(id).includes(input));
}

export function skillIdentity(id: string) {
  return { skill_id: id, demo_path: `/${id}`, aliases: skillAliases(id) };
}
