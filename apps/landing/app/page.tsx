import { BirdeyeDocs } from '../components/birdeye-docs';
import { readCatalog } from '../lib/catalog';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const catalog = await readCatalog().catch(() => undefined);
  return <BirdeyeDocs initialCatalog={catalog} />;
}
