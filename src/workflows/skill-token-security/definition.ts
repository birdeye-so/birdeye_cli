import { defineWorkflow } from "../types.js";
import { tokenDataPolicy } from "../token-data.js";
export default defineWorkflow({
  ...tokenDataPolicy,
  id: "skill-token-security",
  title: "Token Security Check",
  purpose:
    "Inspect a Solana token's contract controls and reported security flags. Use for a focused checklist before deeper token research.",
  produces:
    "Security observations with authority evidence, transfer-fee fields, provider-reported honeypot/LP status where available, and unknown checks.",
  guide: {
    input: "A Solana token address.",
    useCases: [
      "Check whether mint, freeze or metadata controls remain active.",
      "Inspect reported transfer restrictions without paying for a complete DD report.",
    ],
    instructions:
      "Runs one security request. Treat reported flags as provider observations. On Solana, explicit null ownerAddress/freezeAuthority means the authority is inactive; missing or malformed authority remains unknown. Other null evidence stays unknown. This does not audit source code, simulate a sale or independently verify LP locks.",
  },
  limitations: [
    "Security payloads vary by token; absent fields remain unknown. No composite safety score or automatic trading verdict is produced.",
    "Provider-reported honeypot and LP-lock values are not independent simulation or lock verification. Transfer fees are interpreted only with explicit units.",
  ],
  plan({ input: a, add }) {
    add("security", "token.security", { address: a.address });
  },
});
