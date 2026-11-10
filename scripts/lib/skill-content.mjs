import { readFileSync } from "node:fs";
import { z } from "zod";

const strings = z.array(z.string().trim().min(1)).min(1);
const schema = z
  .object({
    schemaVersion: z.literal(1),
    skills: z.record(
      z.string().regex(/^skill-[a-z0-9-]+$/),
      z
        .object({
          description: z.string().trim().min(1),
          use_cases: strings,
          core_capabilities: strings,
          just_say_to_your_agent: strings,
          supported_chains: strings,
          limitations: strings,
          sample_output: z
            .object({
              format: z.literal("text"),
              kind: z.literal("illustrative"),
              description: z.string().min(1),
              output: z.string().min(1),
            })
            .strict()
            .optional(),
        })
        .strict(),
    ),
  })
  .strict();
let previous, parsed;
export function readSkillContent() {
  const text = readFileSync(
    new URL("../../catalog/skill-content.json", import.meta.url),
    "utf8",
  );
  if (text !== previous) {
    parsed = schema.parse(JSON.parse(text));
    previous = text;
  }
  return parsed.skills;
}
export function skillContent(id) {
  const content = readSkillContent()[id];
  if (!content)
    throw new Error(
      `Missing editorial content for ${id}: edit catalog/skill-content.json`,
    );
  return content;
}
export function validateSkillContent(definitions) {
  const content = readSkillContent();
  const ids = new Set(definitions.map((item) => item.kind));
  for (const id of Object.keys(content))
    if (!ids.has(id))
      throw new Error(`Editorial content has no current skill: ${id}`);
  for (const definition of definitions) {
    const authored = skillContent(definition.kind);
    if (
      JSON.stringify([...authored.supported_chains].sort()) !==
      JSON.stringify([...definition.supportedChains].sort())
    )
      throw new Error(
        `Editorial chains do not match implemented chains for ${definition.kind}`,
      );
  }
}
