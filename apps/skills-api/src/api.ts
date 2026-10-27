import { z } from 'zod';
import {skillIconUrl} from './icons.js';
import { readCatalog } from './catalog.js';
import { openSkillStats, type SkillAction } from './store.js';

const headers = {'Cache-Control': 'no-store, max-age=0'};
const eventSchema = z.object({
  skill_id: z.string().min(1).max(200),
  action: z.enum(['view', 'download']),
}).strict();
const skillSchema = eventSchema.omit({action: true});
function response(status: number, reason: string, message: string, data: unknown = null) {
  return Response.json({code: status === 200 ? 0 : status, reason, message, data}, {status, headers});
}
function unavailable() {
  return response(503, 'SERVICE_UNAVAILABLE', 'Skill catalog or statistics are temporarily unavailable.');
}

export async function listSkills(request: Request) {
  try {
    const category = new URL(request.url).searchParams.get('category');
    const catalog = await readCatalog();
    if (category !== null && !catalog.categories.some(item => item.id === category)) {
      return response(400, 'INVALID_CATEGORY', 'Unknown category.');
    }
    const store = openSkillStats();
    try {
      const counts = new Map(store.list().map(item => [item.skill_id, item]));
      const list = catalog.skills.filter(skill => category === null || skill.category === category).map(skill => ({
        ...skill, skill_id: skill.id, icon_url: skillIconUrl(skill.id),
        view_count: counts.get(skill.id)?.view_count ?? 0,
        download_count: counts.get(skill.id)?.download_count ?? 0,
      }));
      return response(200, '', 'success', {list});
    } finally { store.close(); }
  } catch { return unavailable(); }
}

export async function recordSkillAction(request: Request, action?: SkillAction) {
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return response(415, 'UNSUPPORTED_MEDIA_TYPE', 'Use Content-Type: application/json.');
  }
  let input: z.infer<typeof eventSchema>;
  try {
    const body: unknown = await request.json();
    input = action ? {...skillSchema.parse(body), action} : eventSchema.parse(body);
  } catch {
    return response(400, 'INVALID_INPUT', 'Expected a skill_id string and a valid action for the stat endpoint.');
  }
  try {
    const catalog = await readCatalog();
    if (!catalog.skills.some(skill => skill.id === input.skill_id)) {
      return response(404, 'SKILL_NOT_FOUND', 'Unknown skill_id.');
    }
    const store = openSkillStats();
    try { store.increment(input.skill_id, input.action); }
    finally { store.close(); }
    return response(200, '', 'success');
  } catch { return unavailable(); }
}


export async function listCategories() {
  try {
    const catalog = await readCatalog();
    const list = catalog.categories.map(category => ({
      ...category, skill_count: catalog.skills.filter(skill => skill.category === category.id).length,
    })).filter(category => category.skill_count > 0);
    return response(200, '', 'success', {list});
  } catch { return unavailable(); }
}
