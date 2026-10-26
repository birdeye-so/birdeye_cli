import { z } from 'zod';
const category = z.object({id: z.string(), title: z.string(), description: z.string()});
const resource = z.object({id: z.string(), title: z.string(), category: z.string(), description: z.string(), source: z.string()});
export const catalogSchema = z.object({
  schemaVersion: z.literal(1), revision: z.string().min(1), updatedAt: z.iso.datetime(), cliVersion: z.string(),
  site: z.object({name: z.string(), headline: z.string(), description: z.string()}),
  categories: z.array(category), skills: z.array(resource),
  workflows: z.array(resource.extend({purpose: z.string(), produces: z.string(), subject: z.string(), featured: z.boolean(), command: z.string(), estimatedCu: z.number().nonnegative(), maxRequests: z.number().nonnegative(), notes: z.array(z.string()), steps: z.array(z.object({id: z.string(), operation: z.string(), cost: z.number().nonnegative()}))})),
  documents: z.record(z.string(), z.string()),
}).superRefine((value, ctx) => {
  const categories = new Set(value.categories.map(item => item.id));
  for (const item of [...value.workflows, ...value.skills]) if (!categories.has(item.category)) ctx.addIssue({code: 'custom', message: `Unknown category: ${item.category}`});
  for (const items of [value.categories, value.skills, value.workflows]) if (new Set(items.map(item => item.id)).size !== items.length) ctx.addIssue({code: 'custom', message: 'Duplicate catalog IDs'});
});
export type Catalog = z.infer<typeof catalogSchema>;
export type Workflow = Catalog['workflows'][number];
export type Skill = Catalog['skills'][number];
export type Resource = (Workflow & {kind: 'workflow'}) | (Skill & {kind: 'skill'});
