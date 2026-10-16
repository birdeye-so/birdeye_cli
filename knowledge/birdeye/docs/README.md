# bds-docs-mintlify

Mintlify documentation for Birdeye Data Services.

Custom support panel for Mintlify Starter, using Chatwoot + OpenAI with human handoff:
[setup instructions](.mintlify/support-bot/README.md).
Knowledge retrieval uses LlamaIndex Python over published MD/MDX, snippets and OpenAPI sources, including release notes.
For Mintlify-hosted docs, run Chatwoot and the AI backend separately over HTTPS:
[production deployment](.mintlify/support-bot/deploy/README.md).

For Ubuntu 22.04 / 24.04 dev deployment with every service bound only to an assigned
private IPv4, use the [private-only setup wizard](.mintlify/support-bot/deploy/dev-private/README.md).
This profile generates HTTP upstream/location snippets for your existing Nginx;
you integrate them manually. It does not start Caddy or modify/reload Nginx.

```bash
npm --prefix .mintlify/support-bot run knowledge:up
npm --prefix .mintlify/support-bot run panel:local
npm --prefix .mintlify/support-bot start
```

The commands above reuse the dedicated local Docker pilot. Open the full docs at
http://localhost:3000/getting-started and select **Ask Birdeye AI**. Backend
credentials stay in `.mintlify/support-bot/.env`. The older setup wizard configures
the Website widget; use the panel provisioning commands for the custom panel.
