import { syncSkillPackages } from "./lib/skill-packages.mjs";
await syncSkillPackages({ check: process.argv.includes("--check") });
console.log("Skill packages: resources and local links verified");
