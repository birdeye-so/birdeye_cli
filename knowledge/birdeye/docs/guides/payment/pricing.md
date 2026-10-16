---
title: "Pricing"
description: "Pricing plans, included compute units, overage rates, and payment details for Birdeye Data Services."
metadata:
  robots: "index"
---

Welcome to **Birdeye Data Services** pricing guide. Below are the details of our pricing plans designed to meet the diverse needs of developers, businesses, and enterprises.

# Summary

| Package (X) | Base Price (A) | Included Compute Units (B) | Data Access (D) | Rate Limit (E) | Cost per 1M additional CUs (F) |
| :-- | :-- | :-- | :-- | :-- | :-- |
| **Standard** | 0 | 30,000 | [Limited](/guides/data-accessibility-by-packages) | 1 rps\* | No additional CUs |
| **Lite** | \$39 | 2,500,000 | [Most APIs](/guides/data-accessibility-by-packages) | 15 rps\* | \$23 |
| **Starter** | \$99 | 8 Millions | [Most APIs](/guides/data-accessibility-by-packages) | 15 rps\* | \$19.9 |
| **Premium** | \$199 | 20 Millions | [Most APIs \+ Websockets](/guides/data-accessibility-by-packages) | 50 rps\* | \$9.9 |
| **Business** | \$499 | 60 Millions | [All APIs \+ Websockets](/guides/data-accessibility-by-packages) | 100 rps\* | \$6.9 |
| **Business (B-15)** | \$899 | 150 Millions | [All APIs \+ Websockets](/guides/data-accessibility-by-packages) | 150 rps\* | \$4.5 |
| **Business (B-30)** | \$1350 | 300 Millions | [All APIs \+ Websockets](/guides/data-accessibility-by-packages) | 150 rps\* | \$4.5 |
| **Business (B-50)** | \$2050 | 500 Millions | [All APIs \+ Websockets](/guides/data-accessibility-by-packages) | 150 rps | \$3.5 |
| **Growth AutoScale** | Custom | Start at 100 Millions at 699\$ | Custom | 150 rps _9000 rpm_\* | Custom |
| **Enterprise** | Custom | Custom | Custom | Custom | Custom |

\*rps: request per second

\*\* rpm: request per minute

\*\*\* Premium package includes 500 websocket connections. See the [Compute Unit Cost](/guides/what-is-compute-unit-cost) page for compute unit per byte details.

\*\*\*\* Business packages include 2000 websocket connections. See the [Compute Unit Cost](/guides/what-is-compute-unit-cost) page for compute unit per byte details.

Total Cost (by month) should be:

<Callout icon="🙂">
  ### Total Cost = Base Price \+ Additional CUs \* Overage Price
</Callout>

or in more exact terms:

<Callout icon="🤖">
  ### Cost(X) = A(X) \+ \[(T(X) - B(X))/1,000,000\] \* F(X)
</Callout>

in which,

- X = Package Type
- T = Total number of CUs used in the month
- A = Base price of X
- B = Number of CUs included in X
- F = Cost per additional CUs in the X package

# Compute Unit Pricing

Compute units are a measure of the computational resources consumed by each API call. Pricing is based on the complexity and resource requirements of individual APIs. Check the cost in the [Compute Unit Cost](/guides/what-is-compute-unit-cost) section.

# WebSocket pricing

- WebSocket data uses different overage pricing. See the bottom of the [Compute Unit Cost](/guides/what-is-compute-unit-cost) page, or contact the Birdeye team at [bds.support@birdeye.so](mailto:bds.support@birdeye.so) for the WebSocket Concentration package.

### AutoScale Overage Billing

AutoScale is available starting with the **B-10A** plan, which includes **100 million Compute Units (CUs)** for **\$699/month**. Once the included CUs are exhausted, your service continues without interruption and additional usage is billed automatically based on progressive overage tiers.

**Example (B-10A):**

- Monthly plan: **\$699**, includes **100M CUs**
- **100M–150M CUs:** **\$6.90 / 1M CUs**
- **150M–500M CUs:** **\$4.50 / 1M CUs**
- **Above 500M CUs:** **\$3.50 / 1M CUs**

Overage charges are applied incrementally whenever a usage threshold is reached, ensuring uninterrupted service while automatically benefiting from lower rates at higher usage levels. For details on how charges are calculated at each threshold, see the **Partial Overage Charge Rule**:

[https://data.birdeye.so/docs/guides/payment/overage-charge-rule](/guides/payment/overage-charge-rule)

# Additional Information

- All prices are in USD.
- Prices are subject to change based on market conditions.
- For custom pricing inquiries, please contact our sales team.

Thank you for choosing Birdeye APIs. If you have any questions or need assistance, feel free to reach out to our support team.

<br />
