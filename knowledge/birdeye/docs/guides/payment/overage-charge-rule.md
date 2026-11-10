---
title: "Overage Charge rule"
metadata:
  robots: "index"
next:

---

## 1. Stripe Users

For customers paying via Stripe, the overage charge policy is structured to handle excess usage effectively, ensuring service continuity while aligning charges with usage levels.

### Key Points:

**Billing Cycle**: Overage charges are applied based on specific usage tiers, with higher included CU allowances permitting greater overage thresholds before additional charges are incurred.

**Overage** is a post-paid model that allows users to continue using data after their quota is used up, charged at a low overage cost.

When the overage amount reaches the **Partial Overage Charge** threshold (a predefined amount depending on the specified plan), the system will automatically charge to reset the post-paid allowance.

**Payment Failure Consequences:**

- Suspended Access: If an overage payment fails, the user's access will be suspended within 1 day. To resume access, the user must settle the overdue payment.
- Cancellation: If the payment remains unresolved for 3 days, the account will be canceled. After cancellation, the user must purchase a new package to regain access.

#### Usage Tiers:

Overage charges are calculated based on the following incremental tiers:

0–20 million CUs

20–50 million CUs

50–200 million CUs

200–500 million CUs

500–1,000 million CUs

1,000–2,000 million CUs

Above 2,000 million CUs

**Details**

| Package | Partial overage charge each |
| :-- | :-- |
| Lite | \$39 |
| Starter | \$100 |
| Premium | \$100 |
| Business | \$300 |

This structure ensures fairness and transparency in billing, with charges aligned to usage levels and clear steps for users to restore or renew their service if payments fail.

## 2. Crypto Users

For customers paying via cryptocurrency, overage charges are deducted from their prepaid credit, ensuring a smooth handling of excess usage:

- **Prepaid System**: Crypto users pay for their package **3 months in advance**.
- **Overage Deduction**: Overage usage beyond the included CU allowance is **deducted from the prepaid credit**.
- **Renewal Requirement**: Once the prepaid credit is depleted, the user will be notified and required to **renew their payment** to continue using the service.

### Example

- A crypto user with a **3-month prepaid plan** runs out of included CUs after 2 months.
- The overage charges are deducted from the remaining credit.
- Once the credit is depleted, the user will be notified and prompted to renew their plan.

This system ensures that crypto users manage overage charges within their prepaid plan, allowing them to continue service smoothly.

---

## Important Note

For a more convenient experience, users are encouraged to upgrade to a plan with a higher included usage allowance. This helps reduce the likelihood of overage charges and ensures smoother operations. Additionally, WebSocket data has a **different and separate overage charge**. For more information on WebSocket overage pricing, please contact the Birdeye team.