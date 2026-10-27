import { createServer } from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readCatalog} from './catalog.js';
import { listSkills, recordSkillAction, listCategories } from './api.js';

function error(status: number, reason: string, message: string) {
  return Response.json({code: status, reason, message, data: null}, {status});
}

export function createSkillServer(options: {corsOrigins?: string[]; demoDirectory?: string} = {}) {
  const origins = options.corsOrigins ?? (process.env.SKILL_API_CORS_ORIGINS || '*').split(',').map(value => value.trim()).filter(Boolean);
  const demoDirectory = options.demoDirectory || process.env.SKILL_DEMO_DIR || fileURLToPath(new URL('../public/', import.meta.url));
  const assets: Record<string, [string, string]> = {
    '/main.js': ['main.js', 'text/javascript; charset=utf-8'],
    '/main.css': ['main.css', 'text/css; charset=utf-8'],
  };
  return createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Vary', 'Origin');
    const origin = req.headers.origin;
    if (origins.includes('*')) res.setHeader('Access-Control-Allow-Origin', '*');
    else if (origin && origins.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
    const send = async (response: Response) => {
      response.headers.forEach((value, key) => res.setHeader(key, value));
      res.writeHead(response.status);
      res.end(Buffer.from(await response.arrayBuffer()));
    };
    try {
      if (origin && !origins.includes('*') && !origins.includes(origin)) {
        await send(error(403, 'ORIGIN_DENIED', 'Origin is not allowed.'));
        return;
      }
      const url = new URL(req.url || '/', 'http://localhost');
      const path = url.pathname;
      let asset = assets[path];
      if (!asset && /^\/[a-z0-9][a-z0-9-]*$/.test(path)) {
        const catalog = await readCatalog();
        if (catalog.skills.some(skill => path === `/${skill.id}`)) asset = ['index.html', 'text/html; charset=utf-8'];
      }
      if (asset) {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          res.setHeader('Allow', 'GET, HEAD');
          await send(error(405, 'METHOD_NOT_ALLOWED', 'Method not allowed.')); return;
        }
        try {
          const body = await readFile(resolve(demoDirectory, asset[0]));
          res.setHeader('Content-Type', asset[1]);
          res.setHeader('Referrer-Policy', 'no-referrer');
          res.setHeader('X-Frame-Options', 'DENY');
          res.writeHead(200); res.end(req.method === 'HEAD' ? undefined : body);
        } catch {await send(error(503, 'DEMO_UNAVAILABLE', 'Demo assets are unavailable. Run npm run skills-api:build from the repository root.'));}
        return;
      }
      const method = path === '/agent/api/categories' || path === '/agent/api/skills' || path === '/agent/health' ? 'GET'
        : ['/agent/api/skills/view', '/agent/api/skills/download', '/agent/api/skills/stat'].includes(path) ? 'POST' : null;
      if (!method) {await send(error(404, 'NOT_FOUND', 'Route not found.')); return;}
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', `${method}, OPTIONS`);
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.writeHead(204); res.end(); return;
      }
      if (req.method !== method) {
        res.setHeader('Allow', `${method}, OPTIONS`);
        await send(error(405, 'METHOD_NOT_ALLOWED', 'Method not allowed.')); return;
      }
      if (path === '/agent/health') {await send(Response.json({status: 'ok'})); return;}
      if (path === '/agent/api/categories') {await send(await listCategories()); return;}
      if (method === 'GET') {await send(await listSkills(new Request(url))); return;}
      const chunks: Buffer[] = [];
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 8192) {await send(error(413, 'PAYLOAD_TOO_LARGE', 'Body must be at most 8192 bytes.')); return;}
        chunks.push(Buffer.from(chunk));
      }
      const request = new Request(url, {method: 'POST', headers: {'content-type': req.headers['content-type'] || ''}, body: Buffer.concat(chunks)});
      const action = path.endsWith('/view') ? 'view' : path.endsWith('/download') ? 'download' : undefined;
      await send(await recordSkillAction(request, action));
    } catch {
      if (!res.headersSent) await send(error(500, 'INTERNAL_ERROR', 'An unexpected error occurred.'));
      else res.end();
    }
  });
}
