import { createSkillServer } from './server.js';
import { readCatalog } from './catalog.js';
import { openSkillStats } from './store.js';

const host = process.env.SKILL_API_HOST || '127.0.0.1';
const port = Number(process.env.SKILL_API_PORT || 3002);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('SKILL_API_PORT must be an integer from 1 to 65535.');
await readCatalog();
openSkillStats().close();
const server = createSkillServer();
server.listen(port, host, () => console.log(`Skills API listening on http://${host}:${port}`));
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.once(signal, () => {
  server.close(() => process.exit(0));
  setTimeout(() => {server.closeAllConnections(); process.exit(1);}, 10000).unref();
});
