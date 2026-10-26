import { readCatalog } from '../../../lib/catalog';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const headers = {'Cache-Control': 'no-store, max-age=0'};
  try {
    const catalog = await readCatalog();
    const etag = `"${catalog.revision}"`;
    if (request.headers.get('if-none-match') === etag) return new Response(null, {status: 304, headers: {...headers, ETag: etag}});
    return Response.json(catalog, {headers: {...headers, ETag: etag}});
  } catch {
    return Response.json({error: 'The documentation catalog is temporarily unavailable.'}, {status: 503, headers});
  }
}
