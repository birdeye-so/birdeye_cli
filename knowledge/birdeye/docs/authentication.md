---
title: "Authentication"
description: "Generate a Birdeye API key from the Security tab and use it in the X-API-KEY header."
metadata:
  title: "Authentication"
  description: "Generate a Birdeye API key from the Security tab and use it in the X-API-KEY header."
  robots: "index"
icon: "house-user"
---

# Authentication

Birdeye APIs use API-key authentication.

## Get your API key

1. Sign in at [birdeye.so/data-api](https://birdeye.so/data-api)
2. Open the `Security` tab in the dashboard
3. Click `Generate key`
4. Copy the key and store it securely

## Send the key in request headers

Include your key in the `X-API-KEY` header on every request.

```bash
curl --request GET \
  --url 'https://public-api.birdeye.so/defi/price?address=So11111111111111111111111111111111111111112' \
  --header 'X-API-KEY: YOUR_API_KEY' \
  --header 'x-chain: solana'
```

## JavaScript

```js
const response = await fetch(
  "https://public-api.birdeye.so/defi/price?address=So11111111111111111111111111111111111111112",
  {
    headers: {
      "X-API-KEY": process.env.BIRDEYE_API_KEY,
      "x-chain": "solana",
    },
  }
);

const data = await response.json();
```

## Python

```python
import os
import requests

response = requests.get(
    "https://public-api.birdeye.so/defi/price",
    params={"address": "So11111111111111111111111111111111111111112"},
    headers={
        "X-API-KEY": os.environ["BIRDEYE_API_KEY"],
        "x-chain": "solana",
    },
)

print(response.json())
```

## Notes

- Generate keys from the `Security` page in Birdeye Data.
- Rotate keys if they are exposed or shared accidentally.
- Use whitelist and blacklist controls in the dashboard for tighter production security.
- Some endpoints also require headers such as `x-chain` or `x-perp`.
