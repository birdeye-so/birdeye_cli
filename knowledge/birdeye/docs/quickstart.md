---
title: "Quickstart"
icon: "bolt"
sidebarTitle: "Quickstart on Birdeye Data"
---

Create a Birdeye Data account, generate an API key from the Security tab, and make your first Birdeye API request.

To start, create an account at [birdeye.so/data-api](https://birdeye.so/data-api), generate an API key from the `Security` tab, and send it in the `X-API-KEY` header on every request.

Use this flow to start calling Birdeye APIs:

1. Create or sign in to your account at [birdeye.so/data-api](https://birdeye.so/data-api).
2. In the dashboard, open the `Security` tab.
3. Click `Generate key` to create an API key.
4. Copy the key and keep it secure.
5. Use that key in the `X-API-KEY` header when calling Birdeye APIs.

## 1. Create your Birdeye Data account

- Go to [birdeye.so/data-api](https://birdeye.so/data-api)
- Sign up or sign in
- Choose the package that matches your usage and data needs

## 2. Generate an API key

- In the Birdeye Data dashboard, open `Security`
- Click `Generate key`
- Save the key immediately after creation
- Optionally configure whitelist and blacklist rules for production use

## 3. Make your first request

```bash
curl --request GET \
  --url 'https://public-api.birdeye.so/defi/price?address=So11111111111111111111111111111111111111112' \
  --header 'X-API-KEY: YOUR_API_KEY' \
  --header 'x-chain: solana'
```

## 4. Next steps

- Read [Authentication](../authentication)
- Check package access in `Resources > Data Accessibility by Packages`
- Check endpoint pricing in `Resources > Compute Unit Cost`
