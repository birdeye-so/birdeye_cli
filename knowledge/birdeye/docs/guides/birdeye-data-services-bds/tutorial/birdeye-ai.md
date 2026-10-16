---
title: 'Birdeye AI '
deprecated: false
hidden: false
metadata:
  robots: index
---
> ### 🚧  Welcome to the Birdeye MCP Server
>
> **Birdeye MCP Server is currently in Beta.** We're constantly improving, and your feedback is crucial. Please share any thoughts or suggestions.

# 📕 Overview

The official Birdeye MCP Server is now live, making Birdeye data readily available to your AI models and applications. With the Birdeye MCP, you can empower your agents to:

* **Access real-time market data**: Get aggregated prices, market cap, and trading volume for over 15k+ coins on Birdeye.
* **Dive into onchain analytics**: Query onchain DEX price and liquidity data for more than 8M tokens across 10+ networks.
* **Discover market trends**: Instantly find trending coins, new token listings, top gainers/losers, and popular NFT collections.
* **Retrieve rich metadata**: Pull essential details like project descriptions, logos, social links, contract addresses, security info, and more.
* **Analyze historical performance**: Access historical price, market data, and OHLCV for any cryptocurrency.
* **Explore crypto categories**: Effortlessly list coins within specific sectors like Meme, DeFi, Layer 1, AI agent, and more.

![](https://files.readme.io/8c451715855719a095f400422171b8092084e9bc9584db389d5b1cda927f9bc1-dashboard.png)

MCP Demo with Claude Desktop

# 🔥 Getting Started

Connecting your AI to Birdeye is simple. We offer several MCP server options to fit your needs, from keyless access for testing to authenticated connections for production applications.

Most MCP-compatible clients, like Claude Desktop, Gemini CLI, and Cursor, can be configured using a simple JSON file (e.g., `claude_desktop_config.json`)

> ### 📘  Prerequisites
>
> * Make sure your device has `node` installed. You can download it from [nodejs.org/download](https://nodejs.org/en/download)
> * If you are using Claude Desktop, node version 18 or higher is required.
> * Get your API key (see "How to get Birdeye API Key" below)

### How to get Birdeye API Key

1. Login to [bds.birdeye.so](https://bds.birdeye.so)
2. Go to Usages -> Security
3. Click **Generate Authentication key** -> Copy `api key`

### Watch the video below for a quick guide on how to set up the Birdeye MCP Server with Claude as an example.

<Embed typeOfEmbed="youtube" url="https://www.youtube.com/watch?v=YZ_-6nJA2XI" html="%3Ciframe%20class%3D%22embedly-embed%22%20src%3D%22%2F%2Fcdn.embedly.com%2Fwidgets%2Fmedia.html%3Fsrc%3Dhttps%253A%252F%252Fwww.youtube.com%252Fembed%252FYZ_-6nJA2XI%253Ffeature%253Doembed%26display_name%3DYouTube%26url%3Dhttps%253A%252F%252Fwww.youtube.com%252Fwatch%253Fv%253DYZ_-6nJA2XI%26image%3Dhttps%253A%252F%252Fi.ytimg.com%252Fvi%252FYZ_-6nJA2XI%252Fhqdefault.jpg%26type%3Dtext%252Fhtml%26schema%3Dyoutube%22%20width%3D%22854%22%20height%3D%22480%22%20scrolling%3D%22no%22%20title%3D%22YouTube%20embed%22%20frameborder%3D%220%22%20allow%3D%22autoplay%3B%20fullscreen%3B%20encrypted-media%3B%20picture-in-picture%3B%22%20allowfullscreen%3D%22true%22%3E%3C%2Fiframe%3E" href="https://www.youtube.com/watch?v=YZ_-6nJA2XI" providerUrl="https://www.youtube.com/" providerName="YouTube" />

## Pick Your Endpoint

Wrong choice wastes a call. Match the task:

| You need                 | Hit this                           | Ref                                                                                                            |
| ------------------------ | ---------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Supported networks       | `GET /defi/networks`               | [reference/get-defi-networks](../../../data-api/blockchain/get-defi-networks)                             |
| Current token price      | `GET /defi/price`                  | [reference/get-defi-price](../../../data-api/price-ohlcv/get-defi-price)                                   |
| Historical price (line)  | `GET /defi/history_price`          | [reference/get-defi-historical_price_unix](../../../data-api/price-ohlcv/get-defi-historical-price-unix)   |
| OHLCV candles (token)    | `GET /defi/v3/ohlcv`               | [reference/get-defi-v3-ohlcv](../../../data-api/price-ohlcv/get-defi-v3-ohlcv)                             |
| Token stats / overview   | `GET /defi/token_overview`         | [reference/get-defi-token_overview](../../../data-api/stats/get-defi-token-overview)                 |
| Token trades (V3)        | `GET /defi/v3/token/txs`           | [reference/get-defi-v3-token-txs](../../../data-api/transactions/get-defi-v3-token-txs)                     |
| Trending tokens          | `GET /defi/token_trending`         | [reference/get-defi-token_trending](../../../data-api/creation-trending/get-defi-token-trending)                 |
| Meme token list          | `GET /defi/v3/token/meme/list`     | [reference/get-defi-v3-token-meme-list](../../../data-api/meme/get-defi-v3-token-meme-list)         |
| Smart money token list   | `GET /smart-money/v1/token/list`   | [reference/get-smart-money-v1-token-list](../../../data-api/smart-money/get-smart-money-v1-token-list)     |
| Token security / risk    | `GET /defi/token_security`         | [reference/get-defi-token_security](../../../data-api/security/get-defi-token-security)                 |
| Holder distribution      | `GET /holder/v1/distribution`      | [reference/get-holder-v1-distribution](../../../data-api/holder/get-holder-v1-distribution)           |
| Token transfer list      | `POST /token/v1/transfer`          | [reference/post-token-v1-transfer](../../../data-api/balance-transfer/post-token-v1-transfer)                   |
| Wallet current net worth | `GET /wallet/v2/current-net-worth` | [reference/get-wallet-v2-current-net-worth](../../../data-api/wallet-networth-pnl/get-wallet-v2-current-net-worth) |
| Wallet net worth chart   | `GET /wallet/v2/net-worth`         | [reference/get-wallet-v2-net-worth](../../../data-api/wallet-networth-pnl/get-wallet-v2-net-worth)                 |
| Wallet PnL summary       | `GET /wallet/v2/pnl/summary`       | [reference/get-wallet-v2-pnl-summary](../../../data-api/wallet-networth-pnl/get-wallet-v2-pnl-summary)             |
| Wallet tx history (beta) | `GET /v1/wallet/tx_list`           | [reference/get-v1-wallet-tx_list](../../../data-api/wallet-networth-pnl/get-v1-wallet-tx-list)                     |
| Search (token/market)    | `GET /defi/v3/search`              | [reference/get-defi-v3-search](../../../data-api/search-utils/get-defi-v3-search)                           |

## Which MCP Server Should You Use

Here's a breakdown of the available options to help you choose the right one:

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        MCP Server Type
      </th>

      <th>
        Best For
      </th>

      <th>
        Setup Details
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        Remote Server<br />(Authenticated)
      </td>

      <td>
        * Scalable apps, AI agent integrations<br />- Unlocks all tools available under your Demo/Pro plan<br />- Higher, reliable rate limits. Get your API key [here](https://bds.birdeye.so/pricing)

        <br />
      </td>

      <td>
        [https://mcp.birdeye.so/mcp](https://mcp.birdeye.so/mcp"")
      </td>
    </tr>
  </tbody>
</Table>

## Remote Server (Public, Keyless)

The easiest way to get started. Just add the following to your client's `mcp_config.json` file.

> ### 📘  Client-Specific Config
>
> The file name and location depend on your client. Find your config file here: [modelcontextprotocol.io/quickstart](https://modelcontextprotocol.io/quickstart/user#2-add-the-filesystem-mcp-server)

Add the following configuration to your `birdeye_mcp_config.json`:

```rdmd-code lang-json theme-dark
{
    "mcpServers": {
        "birdeye-api-mcp": {
            "command": "npx",
            "args": [
               "-y",
                "mcp-remote@0.1.38",
                "https://mcp.birdeye.so/mcp",
                "--header",
                "x-api-key:${API_KEY}"
            ],
            "env": {
                "API_KEY": <YOUR_API_KEY>
            }
        }
    }
}
```

Here's a quick 2-minute tutorial for setting up the public server with Claude Desktop:

How to Connect Birdeye MCP to Claude Desktop: Step-by-Step Guide - YouTube

[How to Connect Birdeye MCP to Claude Desktop: Step-by-Step Guide](https://www.youtube.com/watch?v=A151Nk_nN_U)

## Remote Server (Authenticated)

### Step 1: Add the configuration

Add the following configuration to your `mcp_config.json`:

JSON

```rdmd-code lang-json theme-dark

{
    "mcpServers": {
        "birdeye-api-mcp": {
            "command": "npx",
            "args": [
                "-y",
                "mcp-remote@0.1.38",
                "https://mcp.birdeye.so/mcp",
                "--header",
                "x-api-key:${API_KEY}"
            ],
            "env": {
                "API_KEY": <YOUR_API_KEY>
            }
        }
    }
}
```

### Step 2: Authorize your MCP access

* Simply paste in your Birdeye API key, and authorize to link your key to the MCP session.

✨ Don't have an API key yet? Upgrade to Pro today! Read more [here](https://bds.birdeye.so/pricing).

* You can also toggle between dynamic/static tools here. Learn more about

# 🚀 Connecting with Claude

Connecting Birdeye MCP to Claude is straightforward. The method varies slightly depending on your Claude plan.

## For Claude Free Users (via Claude Desktop)

You **must use the Claude Desktop app** and modify the configuration file.

1. **Locate `claude_desktop_config.json`**: Follow the instructions [here](https://modelcontextprotocol.io/quickstart/user) to find the file on your system.
2. **Add a server config**: Copy and paste one of the server configs above that matches your use case.
3. **Restart Claude Desktop**: Close and reopen the app for the changes to take effect.

## For Claude Pro Users

> ### 👍  Tips
>
> You can also follow the same steps as the Free users by modifying the `claude_desktop_config.json` file.

1. In Claude ( [claude.ai](https://claude.ai/) or the Desktop app), click on 'Add connectors' in your chat.
   ![](https://files.readme.io/5cd6a58c96962e1ccaa666bb8a4d9d6a7f24dd6afabc4cf294098dd78154cbd1-Screenshot_2025-07-14_at_13.19.24.png)

2. Click on 'Add custom connector'
   ![](https://files.readme.io/1459ea52b1e548f59eaaba665f66a2f42eb446e7b7b43d0222a07f6c8ed63f9b-Screenshot_2025-07-14_at_13.21.30.png)

3. Click on 'Add', and you're ready to go!

# 🔌 Connecting with Other AI Tools

Birdeye MCP works with all major MCP-compatible AI tools. Below are setup guides for the most popular ones.

## 1. Claude Code (CLI)

Add the MCP server via the CLI command:

```bash
claude mcp add birdeye-mcp -- npx -y mcp-remote@0.1.38 https://mcp.birdeye.so/mcp --header "x-api-key:<YOUR_API_KEY>"
```

Or add it directly to your project's `.mcp.json` file:

```json
{
    "mcpServers": {
        "birdeye-mcp": {
            "command": "npx",
            "args": [
                "-y",
                "mcp-remote@0.1.38",
                "https://mcp.birdeye.so/mcp",
                "--header",
                "x-api-key:${API_KEY}"
            ],
            "env": {
                "API_KEY": "<YOUR_API_KEY>"
            }
        }
    }
}
```

## 2. Cursor

Add the following to `.cursor/mcp.json` (project-level) or `~/.cursor/mcp.json` (global):

```json
{
    "mcpServers": {
        "birdeye-mcp": {
            "command": "npx",
            "args": [
                "-y",
                "mcp-remote@0.1.38",
                "https://mcp.birdeye.so/mcp",
                "--header",
                "x-api-key:${API_KEY}"
            ],
            "env": {
                "API_KEY": "<YOUR_API_KEY>"
            }
        }
    }
}
```

## 3. Windsurf

Add the following to `~/.codeium/windsurf/mcp_config.json`:

```json
{
    "mcpServers": {
        "birdeye-mcp": {
            "command": "npx",
            "args": [
                "-y",
                "mcp-remote@0.1.38",
                "https://mcp.birdeye.so/mcp",
                "--header",
                "x-api-key:${API_KEY}"
            ],
            "env": {
                "API_KEY": "<YOUR_API_KEY>"
            }
        }
    }
}
```

## 4. GitHub Copilot (VS Code)

Add the following to `.vscode/mcp.json` in your project:

```json
{
    "inputs": [
        {
            "type": "promptString",
            "id": "birdeye-api-key",
            "description": "Enter your Birdeye API Key",
            "password": true
        }
    ],
    "servers": {
        "birdeye-mcp": {
            "type": "stdio",
            "command": "npx",
            "args": [
                "-y",
                "mcp-remote@0.1.38",
                "https://mcp.birdeye.so/mcp",
                "--header",
                "x-api-key:${input:birdeye-api-key}"
            ]
        }
    }
}
```

## 5. Gemini CLI

Add the following to your `~/.gemini/settings.json`:

```json
{
    "mcpServers": {
        "birdeye-mcp": {
            "command": "npx",
            "args": [
                "-y",
                "mcp-remote@0.1.38",
                "https://mcp.birdeye.so/mcp",
                "--header",
                "x-api-key:${BIRDEYE_API_KEY}"
            ],
            "env": {
                "BIRDEYE_API_KEY": "<YOUR_API_KEY>"
            }
        }
    }
}
```

## Openclaw 

### Convert an MCP Server into an OpenClaw Skill

Follow the steps below to convert an MCP endpoint into a skill that can be used with OpenClaw.

### Prerequisites

Before you begin, make sure you have the following installed:

* Node.js
* npm

You can verify your installation with:

```bash
node -v
npm -v
```

### Install Node.js and npm

#### Unix-like systems

On macOS or Linux, install Node.js and npm using your preferred package manager.

For Ubuntu or Debian:

```bash
sudo apt update
sudo apt install -y nodejs npm
```

For macOS with Homebrew:

```bash
brew install node
```

After installation, confirm that both commands are available:

```bash
node -v
npm -v
```

#### Windows

1. Download and install Node.js from the official website:
   [https://nodejs.org/](https://nodejs.org/)

2. Choose the LTS version.

3. Complete the installer. npm is included automatically.

4. Open Command Prompt or PowerShell and verify the installation:

```powershell
node -v
npm -v
```

### Convert MCP to Skill

Run the following command to convert the MCP server into a skill:

```bash
npx @filiksyos/mcptoskill https://mcp.birdeye.so/mcp --header "x-api-key: XXX" --name=birdeye
```

Replace `XXX` with your actual API key.

### Interactive Setup

During the conversion process, you may be prompted for additional input.

1. If asked for a `Bearer` token, you can enter any placeholder value.

2. When prompted to choose a target/runtime, select one of the following:

* `openclaw`
* `hermes`

Choose only one.

### Notes

* `npx` lets you run the package directly without installing it globally.
* If the command fails on Windows, try running it in PowerShell or Command Prompt as a normal user first, then retry as Administrator only if needed.
* If your shell has issues with quotes, make sure the header argument is passed exactly as shown.

### Example

```bash
npx @filiksyos/mcptoskill https://mcp.birdeye.so/mcp --header "x-api-key: your_api_key_here" --name=birdeye
```

This will generate a skill definition for the `birdeye` MCP server that can be used with your selected runtime.

## 7. OpenAI Codex CLI

Add the following to `~/.codex/config.toml`:

```toml
[mcp_servers.birdeye-mcp]
command = "npx"
args = ["-y", "mcp-remote@0.1.38", "https://mcp.birdeye.so/mcp", "--header", "x-api-key:${BIRDEYE_API_KEY}"]

[mcp_servers.birdeye-mcp.env]
BIRDEYE_API_KEY = "<YOUR_API_KEY>"
```

Or use the CLI command:

```bash
codex mcp add birdeye-mcp -- npx -y mcp-remote@0.1.38 https://mcp.birdeye.so/mcp --header "x-api-key:<YOUR_API_KEY>"
```

## 8. Cline (VS Code Extension)

Open VS Code Settings, navigate to `Cline > MCP Settings`, and add:

```json
{
    "mcpServers": {
        "birdeye-mcp": {
            "command": "npx",
            "args": [
                "-y",
                "mcp-remote@0.1.38",
                "https://mcp.birdeye.so/mcp",
                "--header",
                "x-api-key:${API_KEY}"
            ],
            "env": {
                "API_KEY": "<YOUR_API_KEY>"
            }
        }
    }
}
```

## 9. Roo Code (VS Code Extension)

Add to your project's `.roo/mcp.json` (project-level) or configure via Roo Code settings in VS Code (global):

```json
{
    "mcpServers": {
        "birdeye-mcp": {
            "command": "npx",
            "args": [
                "-y",
                "mcp-remote@0.1.38",
                "https://mcp.birdeye.so/mcp",
                "--header",
                "x-api-key:${API_KEY}"
            ],
            "env": {
                "API_KEY": "<YOUR_API_KEY>"
            }
        }
    }
}
```

## 10. Amazon Q Developer

Add to `~/.aws/amazonq/mcp.json` (global) or `.amazonq/mcp.json` (workspace):

```json
{
    "mcpServers": {
        "birdeye-mcp": {
            "command": "npx",
            "args": [
                "-y",
                "mcp-remote@0.1.38",
                "https://mcp.birdeye.so/mcp",
                "--header",
                "x-api-key:${API_KEY}"
            ],
            "env": {
                "API_KEY": "<YOUR_API_KEY>"
            }
        }
    }
}
```

## 11. JetBrains IDEs (IntelliJ, WebStorm, PyCharm, etc.)

Go to **Settings > Tools > AI Assistant > Model Context Protocol (MCP)** and add a new server with this config:

```json
{
    "mcpServers": {
        "birdeye-mcp": {
            "command": "npx",
            "args": [
                "-y",
                "mcp-remote@0.1.38",
                "https://mcp.birdeye.so/mcp",
                "--header",
                "x-api-key:${API_KEY}"
            ],
            "env": {
                "API_KEY": "<YOUR_API_KEY>"
            }
        }
    }
}
```

> **Note**: Requires JetBrains IDE version 2025.1+ with the MCP Server plugin, or 2025.2+ which has built-in MCP support.

## 12. Continue (VS Code Extension)

Add the following to your Continue configuration (`~/.continue/config.yaml` or via the Continue settings UI):

```json
{
    "mcpServers": {
        "birdeye-mcp": {
            "command": "npx",
            "args": [
                "-y",
                "mcp-remote@0.1.38",
                "https://mcp.birdeye.so/mcp",
                "--header",
                "x-api-key:${API_KEY}"
            ],
            "env": {
                "API_KEY": "<YOUR_API_KEY>"
            }
        }
    }
}
```

## 13. Zed

Open Zed settings (`Cmd+,` on macOS) and add to the `context_servers` section:

```json
{
    "context_servers": {
        "birdeye-mcp": {
            "command": {
                "path": "npx",
                "args": [
                    "-y",
                    "mcp-remote@0.1.38",
                    "https://mcp.birdeye.so/mcp",
                    "--header",
                    "x-api-key:<YOUR_API_KEY>"
                ]
            }
        }
    }
}
```

<br />

# 💡 Example Prompts

Tap into the full potential of Birdeye data — use these prompts to kickstart your next AI build.

### Simple Queries

> * What is the current price of Bitcoin in USD?
> * What is the current price of JUP in USD?
> * What is the top 10 BONK holders?
> * What are the top 3 trending coins on Birdeye right now?
> * What are the top AI coins on Birdeye now?

### Advanced Queries

> * List tokens launched in the last 72 hours with liquidity above $500k. Include price, market cap, liquidity, and 24h volume. Display in an interactive table.
>   ![](https://files.readme.io/fbe05838d1c7d7d4b71e98f3bcc17a09593eafaa9de3b9568c49c444b26185c0-Screenshot_2026-02-13_at_10.21.09.png)
> * Generate a 14-day price chart for Solana (SOL) against USD. Include both price and trading volume.
>   ![](https://files.readme.io/768d86e1dbd0b2b96933bc228622d1ababbdfdc8196eda460262c5495f488e5a-Screenshot_2026-02-12_at_21.25.53.png)

### Creative and Fun Ideas

> * Create a “Whale Moves” dashboard that highlights tokens with significant accumulation from top holders over the past 7 days. Include price change and liquidity.
>   ![](https://files.readme.io/85d4e0616025768f1c4189d3151a3bec3a8f099c6122568943d409c6586fd751-Screenshot_2026-02-12_at_21.33.39.png)
>   Try it here: [claude.ai/public/artifacts](https://claude.ai/public/artifacts/746057a3-cf27-48c4-be93-4367734e2925)
>
> * Build a “Market Mood” view that compares performance of major sectors like AI, Meme, and DeFi over the last 7 days. Display sector averages and total volume.
>   ![](https://files.readme.io/5446d80a83ae508da1fc5fe3d5214debd4f312aa3bf2659aef2c63f594c84ba6-Screenshot_2026-02-13_at_10.07.16.png)
>   Try it here: [claude.ai/public/artifacts](https://claude.ai/public/artifacts/cea3f8e3-a330-41d5-b28b-bd3fb9cade54)

<br />
