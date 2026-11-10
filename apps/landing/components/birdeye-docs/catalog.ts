import { z } from "zod";
const category = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});
const skill = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  description: z.string(),
  source: z.string(),
  featured: z.boolean(),
  usage: z.object({
    input: z.string(),
    instructions: z.string(),
    preview_command: z.string(),
    run_command: z.string(),
    install_command: z.string(),
    result: z.string(),
  }),
});
export const catalogSchema = z
  .object({
    schemaVersion: z.literal(3),
    revision: z.string().min(1),
    updatedAt: z.iso.datetime(),
    cliVersion: z.string(),
    site: z.object({
      name: z.string(),
      headline: z.string(),
      description: z.string(),
    }),
    categories: z.array(category),
    skills: z.array(skill),
    documents: z.record(z.string(), z.string()),
  })
  .superRefine((value, ctx) => {
    const categories = new Set(value.categories.map((item) => item.id));
    for (const item of value.skills)
      if (!categories.has(item.category))
        ctx.addIssue({
          code: "custom",
          message: `Unknown category: ${item.category}`,
        });
    for (const items of [value.categories, value.skills])
      if (new Set(items.map((item) => item.id)).size !== items.length)
        ctx.addIssue({ code: "custom", message: "Duplicate catalog IDs" });
  });
export type Catalog = z.infer<typeof catalogSchema>;
export type Skill = Catalog["skills"][number];
