import { readFile } from 'node:fs/promises';
import { z } from 'zod';

const slug = z.string().regex(/^[a-z0-9][a-z0-9-]*$/);
const schema = z.object({
  schemaVersion: z.literal(4),
  categories: z.array(z.object({id: slug, title: z.string(), description: z.string()})),
  skills: z.array(z.object({id: slug, title: z.string(), category: slug, description: z.string(),
    usage: z.object({input: z.string(), instructions: z.string(), preview_command: z.string(), run_command: z.string(), result: z.string(), install_command: z.string()}).strict(),
    detail: z.object({
      use_cases: z.array(z.string().min(1)).min(1).optional(),
      supported_chains: z.array(slug).min(1).optional(),
      limitations: z.array(z.string().min(1)).min(1).optional(),
      core_capabilities: z.array(z.string().min(1)).min(1),
      just_say_to_your_agent: z.array(z.string().min(1)).min(1),
      cli_parameters: z.array(z.object({param: z.string().regex(/^--[a-z0-9-]+$/), required: z.boolean(), values: z.string().min(1), default: z.json()}).strict()).min(1),
      sample_output: z.object({format: z.literal('json'), kind: z.literal('estimate'), description: z.string().min(1), command: z.string().min(1), output: z.record(z.string(), z.json()),
        example: z.object({format: z.literal('text'), kind: z.literal('illustrative'), description: z.string().min(1), output: z.string().min(1)}).strict().optional(),
      }).strict(),
    }).strict(),
  }).strict()),
}).strict().superRefine((catalog, context) => {
  const categories = new Set(catalog.categories.map(item => item.id));
  if (categories.size !== catalog.categories.length || new Set(catalog.skills.map(item => item.id)).size !== catalog.skills.length) context.addIssue({code: 'custom', message: 'Duplicate catalog IDs.'});
  for (const skill of catalog.skills) if (!categories.has(skill.category)) context.addIssue({code: 'custom', message: `Unknown category: ${skill.category}`});
});
export async function readCatalog() {
  const path = process.env.SKILL_CATALOG_PATH || new URL('../catalog.json', import.meta.url);
  return schema.parse(JSON.parse(await readFile(path, 'utf8')));
}
