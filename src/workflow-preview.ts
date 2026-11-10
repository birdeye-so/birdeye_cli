import { z } from "zod";
import { catalog, type Entry } from "./catalog.js";
import { caseKinds, planCase, workflowCatalog } from "./workflows.js";
import { stepGuides } from "./workflow-guides.js";

const previewInput = z
  .object({ kind: z.enum(caseKinds), address: z.string().optional() })
  .passthrough();
const placeholder = "So11111111111111111111111111111111111111112";

/** Free planning only. Missing required subjects never become executable input. */
export function previewCase(input: unknown) {
  const raw = previewInput.parse(input);
  const recipe = workflowCatalog().find((item) => item.kind === raw.kind)!;
  const needsWallets =
    recipe.subject === "wallets" &&
    (!Array.isArray(raw.wallets) || !raw.wallets.length);
  const needsAddress =
    (["token", "wallet"].includes(recipe.subject) && !raw.address) ||
    needsWallets;
  const plan = planCase({
    ...raw,
    ...(needsWallets
      ? { wallets: [placeholder] }
      : needsAddress
        ? { address: placeholder }
        : {}),
  });
  return {
    ...plan,
    input: {
      ...plan.input,
      ...(needsAddress
        ? {
            address: undefined,
            ...(needsWallets ? { wallets: undefined } : {}),
          }
        : {}),
    },
    needsAddress,
    purpose: recipe.purpose,
    produces: recipe.produces,
    steps: plan.steps.map((step) => {
      const entry: Entry = catalog[step.operation];
      const schema = z.toJSONSchema(entry.schema);
      const lockedParams = Object.keys(schema.properties ?? {}).filter(
        (key) =>
          recipe.fixedSources ||
          ["address", "wallet", "token_address"].includes(key),
      );
      const params = { ...step.params };
      if (needsAddress)
        for (const key of ["address", "wallet", "token_address"])
          delete params[key];
      const requests = step.subjects?.take ?? 1;
      return {
        ...step,
        params,
        ...stepGuides[step.operation],
        method: entry.method ?? "GET",
        path: entry.path,
        inputSchema: schema,
        lockedParams,
        cuPerRequest: step.cost,
        maxRequests: requests,
        estimatedCu: requests * step.cost,
        warnings: entry.warnings ?? [],
      };
    }),
  };
}
