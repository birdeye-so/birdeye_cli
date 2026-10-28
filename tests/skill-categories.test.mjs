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
