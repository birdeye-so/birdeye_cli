import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, cp, rm, readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {skillPackages, syncSkillPackages, validateSkillLinks} from '../scripts/lib/skill-packages.mjs';
import {createResourceCatalog} from '../scripts/lib/catalog.mjs';

test('each skill installs in isolation with current references and no sibling package links', async () => {
  await syncSkillPackages({check: true});
  const temporary = await mkdtemp(resolve(tmpdir(), 'isolated-skills-'));
  try {
    for (const skill of await skillPackages()) {
      const destination = resolve(temporary, skill.id);
      await cp(skill.directory, destination, {recursive: true});
      await validateSkillLinks(destination);
      const entry = await readFile(resolve(destination, 'SKILL.md'), 'utf8');
      assert.match(entry, /birdeye-cli/);
      assert.match(entry, /Node\.js >=22\.16/);
    }
  } finally {await rm(temporary, {recursive: true, force: true});}
});

test('each public skill has matching installable instructions and no second resource type', async () => {
  const catalog = await createResourceCatalog();
  const packages = await skillPackages();
  assert.equal(catalog.skills.length, 23);
  assert.equal(packages.filter(item => !item.legacy).length, 23);
  assert.equal(packages.filter(item => item.legacy).length, 4);
  assert.ok(!('workflows' in catalog));
  for (const skill of catalog.skills) {
    const packaged = packages.find(item => item.id === skill.id);
    assert.ok(packaged && !packaged.legacy);
    assert.match(skill.usage.install_command, new RegExp(`--skill ${skill.id} --global$`));
    const instructions = await readFile(resolve(packaged.directory, 'SKILL.md'), 'utf8');
    assert.ok(instructions.includes(skill.usage.run_command));
    assert.ok(instructions.includes(skill.description));
    assert.ok(!('steps' in skill) && !('workflow_ids' in skill));
  }
});
