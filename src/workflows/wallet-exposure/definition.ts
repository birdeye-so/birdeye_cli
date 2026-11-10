import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  tokenPolicy: "unsupported",
  id: "wallet-exposure",
  title: "Wallet Exposure",
  category: "wallet",
  family: "legacy",
  subject: "wallet",
  description: "Portfolio weights within the fetched page",
  purpose:
    "See how a wallet's observed asset value is distributed across the holdings page you fetch.",
  produces:
    "Asset values and relative weights for that page. Balances do not measure investment returns.",
  source: "docs/workflows/README.md",
  window: "day",
  plan(context) {
    const { input: a, add } = context;
    add("holdings", "portfolio.holdings", { wallet: a.address, limit: 100 });
  },
});
