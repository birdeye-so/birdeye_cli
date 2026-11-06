import test from "node:test";
import assert from "node:assert/strict";
import {build} from "esbuild";
import {createResourceCatalog} from "../scripts/lib/catalog.mjs";
import {workflowCatalog} from "../dist/workflows.js";
await build({entryPoints:["web/skill-categories.ts"],outfile:".test-dist/skill-categories.mjs",bundle:true,platform:"node",format:"esm"});
const {skillCategories,skillsInCategory}=await import("../.test-dist/skill-categories.mjs");
test("demo categories and membership match the public agent catalog",async()=>{
 const catalog=await createResourceCatalog(),cases=workflowCatalog();
 assert.deepEqual(skillsInCategory(cases).map(s=>s.kind),catalog.skills.map(s=>s.id));
 assert.deepEqual(skillCategories(cases),catalog.categories.map(c=>({...c,skill_count:catalog.skills.filter(s=>s.category===c.id).length})).filter(c=>c.skill_count>0));
 for(const category of skillCategories(cases)){
   assert.deepEqual(skillsInCategory(cases,category.id).map(s=>s.kind),catalog.skills.filter(s=>s.category===category.id).map(s=>s.id));
 }
});
test("category field controls membership even when the old UI group disagrees",()=>{
 const cases=[{kind:"visible",family:"data-skills",category:"wallet",group:"token"},{kind:"archived",family:"legacy",category:"wallet",group:"wallet"}];
 assert.deepEqual(skillsInCategory(cases,"wallet").map(s=>s.kind),["visible"]);
 assert.deepEqual(skillsInCategory(cases,"token"),[]);
 assert.deepEqual(skillCategories(cases).map(c=>[c.id,c.skill_count]),[["wallet",1]]);
});
test("demo skill icons are the Skills API icons, inlined for every public skill",async()=>{
 await build({entryPoints:["web/skill-icon.tsx","apps/skills-api/src/icons.ts"],outdir:".test-dist/skill-icon",bundle:true,platform:"node",format:"esm",jsx:"automatic",external:["react"]});
 const {skillIconShapes}=await import("../.test-dist/skill-icon/web/skill-icon.js");
 const {skillIconName,skillIconUrl}=await import("../.test-dist/skill-icon/apps/skills-api/src/icons.js");
 for(const skill of (await createResourceCatalog()).skills){
   const name=skillIconName(skill.id);
   assert.notEqual(name,"file-text",skill.id);
   assert.ok(skillIconShapes[name]?.length,`${skill.id}: ${name}`);
   assert.ok(skillIconUrl(skill.id).includes(`/lucide/${name}.svg`));
 }
});
