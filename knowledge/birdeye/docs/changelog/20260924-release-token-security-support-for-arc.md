---
title: 2026.09.24 - Token Security Support for Arc
description: Added Arc network support to the Token Security API.
---

# 2026.09.24 - Token Security Support for Arc

The **Token Security** API now supports tokens on the `arc` network.

## Features

### Arc Token Security Support

* Add `arc` as a supported chain for token security checks
* Return token security data for Arc token addresses through the existing Token Security endpoint
* Keep the existing request and response format unchanged

## API Reference

[Token - Security](../data-api/security/get-defi-token-security)

```text
GET /defi/token_security
```

