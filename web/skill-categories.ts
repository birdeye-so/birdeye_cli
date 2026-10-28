import catalog from "../catalog/resources.json";

type CategorizedSkill = {category?: string; family?: string};
/** Match the public API catalog: archived workflows never appear in skill filters. */
export function skillsInCategory<T extends CategorizedSkill>(skills: T[], category = "all"): T[] {
  return skills.filter(skill => skill.family !== "legacy" && (category === "all" || skill.category === category));
}

/** IDs, labels and ordering come from the same catalog as /agent/api/categories. */
export function skillCategories(skills: CategorizedSkill[]) {
  return catalog.categories.map(category => ({
    ...category, skill_count: skillsInCategory(skills, category.id).length,
  })).filter(category => category.skill_count > 0);
}
