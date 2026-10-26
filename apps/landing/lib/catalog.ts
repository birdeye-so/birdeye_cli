import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { catalogSchema } from '../components/birdeye-docs/catalog';

// Read at request time: replacing JSON updates a running deployment without rebuilding.
export async function readCatalog() {
  let data: unknown;
  if (process.env.CATALOG_URL) {
    const response = await fetch(process.env.CATALOG_URL, {cache: 'no-store', signal: AbortSignal.timeout(8000)});
    if (!response.ok) throw new Error(`Catalog source returned ${response.status}`);
    data = await response.json();
  } else {
    const path = process.env.CATALOG_PATH || resolve(process.cwd(), 'public/catalog.json');
    data = JSON.parse(await readFile(/* turbopackIgnore: true */ path, 'utf8'));
  }
  const catalog = catalogSchema.parse(data);
  const {revision: _revision, updatedAt: _updatedAt, ...content} = catalog;
  return {...catalog, revision: createHash('sha256').update(JSON.stringify(content)).digest('hex').slice(0,16)};
}
