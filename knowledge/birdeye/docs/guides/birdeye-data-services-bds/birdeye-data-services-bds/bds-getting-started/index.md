---
title: BDS — Getting Started
deprecated: false
hidden: false
icon: 🚀
metadata:
  robots: index
next:
  description: Access Documentation & Endpoints
  pages:
    - slug: manage-your-dashboard
      title: Manage your Dashboard
      type: basic
---
## Log In to BDS Dashboard

* Use your credentials from [Step 1](https://docs.birdeye.so/docs/birdeye-account#/) to [Login](https://bds.birdeye.so/auth/sign-in).
* You’ll land on the [BDS Dashboard](https://bds.birdeye.so/user/overview)—your central hub for API key management, billing, analytics, and support.

## Obtain API Keys

* Navigate to [Security tab](https://bds.birdeye.so/user/security)  in the sidebar.
* Click `Generate Key`, then copy your new API key.
* Store it securely and include it in your header:

```
X-API-KEY: <your-api-key>
```

## Monitor Usage & Apply Restrictions

* Go to [Metrics](https://bds.birdeye.so/user/metrics)  to view your:
  * Compute Units (CU) consumed
  * API request counts
  * Error rates
* From [Security tab](https://bds.birdeye.so/user/security), you can:
  * Apply origin/IP restrictions
  * Regenerate or revoke keys as needed

## Billing & Subscription Control

* In [Packages](https://bds.birdeye.so/user/packages)  sections, view your plan, CU pricing tiers, overage policies, and cancellation terms.
* Upgrade or change plans instantly via the UI.
* Read policies on:
  * Service cancellation
  * CU overages
  * CU carry‑over (most plans do not allow carry‑over)

## Generate & Use CU-Based Endpoints

* Every API call uses compute units (CU) — cost varies by endpoint.
* Track cumulative CU via Monitoring and watch for overage alerts.

## Quick Setup Checklist

* [Sign up](https://docs.birdeye.so/update/docs/birdeye-account#/)
* Log in: [https://bds.birdeye.so/auth/sign-in](https://bds.birdeye.so/auth/sign-in)
* Get API Key:
  * Authentication & API Keys
* Read API Docs
  * Documentation:
    * REST API
    * Websocket
* Check Usage
  * Monitoring / Metrics
* Restrict Key Access
  * Auth & API Keys → Edit restrictions
* Manage Billing & Plan
  * Pricing / Payment
  * Compute Unit Cost

## Developer Recommendations

* Key Security: Store API keys securely and rotate periodically.
* Rate Awareness: Monitor CUs to avoid data delays or overage fees.
* Integration Readiness: Explore WebSocket sections for streaming real-time data.
* Access Control: Use IP/origin restrictions to secure APIs in production.