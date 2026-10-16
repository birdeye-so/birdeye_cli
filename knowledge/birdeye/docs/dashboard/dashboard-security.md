---
title: Security
description: Full control over your API access, helping ensure secure and compliant usage
---

The Security Dashboard in Birdeye Data gives you full control over your API access, helping ensure secure and compliant usage. Here, you can generate and manage your authentication keys, define trusted IP addresses via whitelisting, and restrict unwanted access through blacklisting.

Whether you're a solo developer or part of a security-focused enterprise, this section is essential for protecting your data pipeline and managing usage policies effectively.

<Frame>
  <img src="https://files.readme.io/b8935037948cd3e55dac46161826e4da495fce2e6bc082a87bb47a436081c844-Security.png" alt="Dashboard - Security" />
</Frame>

## Authentication Key Management

- Purpose: These keys are required to authenticate your API requests.
- Action: Click "Generate key +" to create a new API key.
- We have a small note that shows Total rate limit is set for your account

<Tip>
  Store your key securely, treat it like a password.
</Tip>

## Whitelist Configuration

- Restrict API access to a predefined list of IP addresses.
- Click "Add +" in the WhiteList section to input allowed IPs.
- Ideal for environments with static IPs, internal tools, or corporate firewalls.

## Blacklist Configuration

- Block specific IP addresses from accessing your APIs.
- Click "Add +" in the BlackList section to input banned IPs.
- Use this to respond to suspicious activity or unauthorized attempts.

## Best Practices

- Rotate authentication keys periodically.
- Use whitelisting for production environments.
- Monitor audit logs regularly (available in the Audit Logs section).
- Never expose your API keys in frontend code or public repositories.
