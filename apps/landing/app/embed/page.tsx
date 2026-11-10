import { BirdeyeDocs } from "../../components/birdeye-docs";
import { readCatalog } from "../../lib/catalog";
export const dynamic = "force-dynamic";
export default async function EmbedPage() {
  const catalog = await readCatalog().catch(() => undefined);
  return (
    <BirdeyeDocs
      basePath={process.env.NEXT_PUBLIC_BASE_PATH || ""}
      initialCatalog={catalog}
      embedded
    />
  );
}
