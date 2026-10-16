---
description: "''"
title: Public APIs - Deprecate soon
excerpt: Updated on 9 January 2024.
deprecated: false
hidden: true
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
We want to inform you that our Public APIs will be deprecated soon, effective from **April 15th, 2024**. This decision is part of our commitment to enhancing the quality and security of our services.

# Key Dates:

**Deprecation Date:** **April 15th, 2024**\
**End of Service:** **April 30th, 2024**

# What Does This Mean?

Public APIs will no longer be accessible after the deprecation date.\
To continue using our data services, consider migrating to our Standard, Premium, Business, or Enterprise API tiers available through our platform.

# Migration Steps:

* Visit the Birdeye dashboard to explore upgraded API tiers.
* Choose a subscription plan that aligns with your data access needs.
* Obtain new API keys associated with your selected tier.
* Update your integration to use the new API keys and endpoints: change your API endpoints in Public APIs to equivalent APIs in the new standard:

| Public API Endpoints                                                                                      | Equivalent API Endpoints for Replacement                                                              |
| :-------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| [https://public-api.birdeye.so/public/price](https://public-api.birdeye.so/public/price)                  | [https://public-api.birdeye.so/defi/price](https://public-api.birdeye.so/defi/price)                  |
| [https://public-api.birdeye.so/public/multi\_price](https://public-api.birdeye.so/public/multi_price)     | [https://public-api.birdeye.so/defi/multi\_price](https://public-api.birdeye.so/defi/multi_price)     |
| [https://public-api.birdeye.so/public/history\_price](https://public-api.birdeye.so/public/history_price) | [https://public-api.birdeye.so/defi/history\_price](https://public-api.birdeye.so/defi/history_price) |
| [https://public-api.birdeye.so/public/tokenlist](https://public-api.birdeye.so/public/tokenlist)          | [https://public-api.birdeye.so/defi/tokenlist](https://public-api.birdeye.so/defi/tokenlist)          |
| [https://public-api.birdeye.so/public/exists\_token](https://public-api.birdeye.so/public/exists_token)   | NA. This endpoints will be removed.                                                                   |
| [https://public-api.birdeye.so/public/amm\_supported](https://public-api.birdeye.so/public/amm_supported) | NA. This endpoints will be removed.                                                                   |

# Need Assistance?

If you have any questions or need assistance with the migration process, our support team is here to help. Reach out via Twitter or Discord.

We appreciate your understanding and cooperation as we work to provide you with an improved and more secure data experience.

Thank you for being a valued member of the Birdeye community.

***

# Generate your API Keys

In order to use Birdeye's APIs (both public and paid options), you need to have API Keys - which can be easily generated in your Profile page.\
Click [HERE](/authentication) for more details on how to generate API Keys.

# Many APIs are FREE

Birdeye offers FREE access to some of our APIs in our Standard Package, reflecting our commitment to supporting the developer community and early-stage startups. By providing these APIs at no cost, we aim to facilitate innovation and collaboration within the crypto ecosystem, enabling projects to access essential trading data. Our objective extends beyond providing free access; we also aim to establish a common data standard for crypto trading information.

For more established projects seeking advanced capabilities and tailored solutions, we offer Premium and Business APIs Package, which are detailed in a separate section below.

# Try it out

Visit the following page to try out all the endpoints:

### API Base URL: [https://public-api.birdeye.so/](https://public-api.birdeye.so/)
