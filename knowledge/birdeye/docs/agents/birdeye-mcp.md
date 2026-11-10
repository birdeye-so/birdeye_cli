---
title: "Birdeye MCP"
description: "Connect Claude, Cursor, and other AI tools to Birdeye Data through the Model Context Protocol"
---

<Note>
  Birdeye MCP Server is currently in Beta. It is under active development, so tool names, response shapes, and rate limits may change. Share feedback through [bds.support@birdeye.so](mailto:bds.support@birdeye.so).
</Note>

The official Birdeye MCP Server makes Birdeye data available to your AI models and applications. This page walks through setup: getting your API key, picking a server, and connecting your client of choice.

## Prerequisites

<Steps>
  <Step title="Install Node.js">
    Node.js 18 or higher is required if you are using Claude Desktop. Download it from [nodejs.org](https://nodejs.org/en/download).
  </Step>
  <Step title="Get your Birdeye API key">
    1. Log in to [bds.birdeye.so](https://bds.birdeye.so)
    2. Go to **Usages** then **Security**
    3. Click **Generate Authentication key** and copy the API key
  </Step>
</Steps>

Prefer to watch instead of read? Here's a short walkthrough of the whole setup, from getting your API key to connecting Claude:

<iframe width="100%" height="400" src="https://www.youtube.com/embed/YZ_-6nJA2XI" title="How to set up the Birdeye MCP Server" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />

With your API key in hand, the next step is picking which server to connect to.

## Which server to use

| Server type | Best for | Endpoint |
| --- | --- | --- |
| Public, keyless | Quick testing, no account needed | `https://mcp.birdeye.so/mcp` |
| Remote, authenticated | Production apps and agent integrations. Unlocks every tool under your Demo or Pro plan, with higher and more reliable rate limits | `https://mcp.birdeye.so/mcp` with your API key |

<Tip>
  Get an API key for the authenticated server at [bds.birdeye.so](https://bds.birdeye.so). Don't have one yet? Upgrade to Pro at [birdeye.so/data-api](https://birdeye.so/data-api).
</Tip>

### Public server (keyless)

The fastest way to get started. Add this to your client's MCP config file (for example `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "birdeye-api-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote@0.1.38",
        "https://mcp.birdeye.so/mcp"
      ]
    }
  }
}
```

### Authenticated server

Add your API key to the same config:

```json
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
        "API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}
```

Paste your Birdeye API key when prompted to authorize the session and link your key to the MCP connection. The client also lets you toggle between dynamic and static tool sets; check the client UI for details if this matters for your setup.

<Tip>
  Find your client's config file location at [modelcontextprotocol.io/quickstart](https://modelcontextprotocol.io/quickstart/user), since the file name and path differ by client.
</Tip>

## Connect with Claude

<Tabs>
  <Tab title="Claude Desktop (Free)">
    1. Locate `claude_desktop_config.json`. See the [MCP quickstart guide](https://modelcontextprotocol.io/quickstart/user) to find it on your system.
    2. Add one of the server configs above.
    3. Restart Claude Desktop for the change to take effect.
  </Tab>
  <Tab title="Claude Pro">
    <Steps>
      <Step title="Open Add connectors">
        In Claude (claude.ai or the Desktop app), click **Add connectors** in the chat.

        <Frame>
          ![Add connectors option in the Claude chat menu](/agents/images/claude-pro-add-connectors-menu.png)
        </Frame>
      </Step>
      <Step title="Add a custom connector">
        Click **Add custom connector**.

        <Frame>
          ![Add custom connector button in the Connectors panel](/agents/images/claude-pro-add-custom-connector.png)
        </Frame>
      </Step>
      <Step title="Enter the server URL">
        Paste `https://mcp.birdeye.so/mcp` and click **Add**.
      </Step>
    </Steps>

    <Tip>
      Claude Pro users can also edit `claude_desktop_config.json` directly, using the same steps as Free users.
    </Tip>
  </Tab>
</Tabs>

## Connect with other AI tools

Birdeye MCP works with any MCP compatible client. Each tab below shows the config for a specific tool; the server args are the same as the authenticated config above.

<Tabs>
  <Tab title="Claude Code">
    Add via the CLI:

    ```bash
    claude mcp add birdeye-mcp -- npx -y mcp-remote@0.1.38 https://mcp.birdeye.so/mcp --header "x-api-key:<YOUR_API_KEY>"
    ```

    Or add directly to your project's `.mcp.json`:

    ```json
    {
      "mcpServers": {
        "birdeye-mcp": {
          "command": "npx",
          "args": ["-y", "mcp-remote@0.1.38", "https://mcp.birdeye.so/mcp", "--header", "x-api-key:${API_KEY}"],
          "env": { "API_KEY": "<YOUR_API_KEY>" }
        }
      }
    }
    ```
  </Tab>
  <Tab title="Cursor">
    Add to `.cursor/mcp.json` (project level) or `~/.cursor/mcp.json` (global):

    ```json
    {
      "mcpServers": {
        "birdeye-mcp": {
          "command": "npx",
          "args": ["-y", "mcp-remote@0.1.38", "https://mcp.birdeye.so/mcp", "--header", "x-api-key:${API_KEY}"],
          "env": { "API_KEY": "<YOUR_API_KEY>" }
        }
      }
    }
    ```
  </Tab>
  <Tab title="Windsurf">
    Add to `~/.codeium/windsurf/mcp_config.json`:

    ```json
    {
      "mcpServers": {
        "birdeye-mcp": {
          "command": "npx",
          "args": ["-y", "mcp-remote@0.1.38", "https://mcp.birdeye.so/mcp", "--header", "x-api-key:${API_KEY}"],
          "env": { "API_KEY": "<YOUR_API_KEY>" }
        }
      }
    }
    ```
  </Tab>
  <Tab title="GitHub Copilot (VS Code)">
    Add to `.vscode/mcp.json` in your project:

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
          "args": ["-y", "mcp-remote@0.1.38", "https://mcp.birdeye.so/mcp", "--header", "x-api-key:${input:birdeye-api-key}"]
        }
      }
    }
    ```
  </Tab>
  <Tab title="Gemini CLI">
    Add to `~/.gemini/settings.json`:

    ```json
    {
      "mcpServers": {
        "birdeye-mcp": {
          "command": "npx",
          "args": ["-y", "mcp-remote@0.1.38", "https://mcp.birdeye.so/mcp", "--header", "x-api-key:${BIRDEYE_API_KEY}"],
          "env": { "BIRDEYE_API_KEY": "<YOUR_API_KEY>" }
        }
      }
    }
    ```
  </Tab>
  <Tab title="OpenAI Codex CLI">
    Add to `~/.codex/config.toml`:

    ```toml
    [mcp_servers.birdeye-mcp]
    command = "npx"
    args = ["-y", "mcp-remote@0.1.38", "https://mcp.birdeye.so/mcp", "--header", "x-api-key:${BIRDEYE_API_KEY}"]
    
    [mcp_servers.birdeye-mcp.env]
    BIRDEYE_API_KEY = "<YOUR_API_KEY>"
    ```

    Or use the CLI directly:

    ```bash
    codex mcp add birdeye-mcp -- npx -y mcp-remote@0.1.38 https://mcp.birdeye.so/mcp --header "x-api-key:<YOUR_API_KEY>"
    ```
  </Tab>
  <Tab title="Cline">
    Open VS Code Settings, navigate to **Cline \> MCP Settings**, and add:

    ```json
    {
      "mcpServers": {
        "birdeye-mcp": {
          "command": "npx",
          "args": ["-y", "mcp-remote@0.1.38", "https://mcp.birdeye.so/mcp", "--header", "x-api-key:${API_KEY}"],
          "env": { "API_KEY": "<YOUR_API_KEY>" }
        }
      }
    }
    ```
  </Tab>
  <Tab title="Roo Code">
    Add to your project's `.roo/mcp.json`, or configure globally through Roo Code settings in VS Code:

    ```json
    {
      "mcpServers": {
        "birdeye-mcp": {
          "command": "npx",
          "args": ["-y", "mcp-remote@0.1.38", "https://mcp.birdeye.so/mcp", "--header", "x-api-key:${API_KEY}"],
          "env": { "API_KEY": "<YOUR_API_KEY>" }
        }
      }
    }
    ```
  </Tab>
  <Tab title="Amazon Q Developer">
    Add to `~/.aws/amazonq/mcp.json` (global) or `.amazonq/mcp.json` (workspace):

    ```json
    {
      "mcpServers": {
        "birdeye-mcp": {
          "command": "npx",
          "args": ["-y", "mcp-remote@0.1.38", "https://mcp.birdeye.so/mcp", "--header", "x-api-key:${API_KEY}"],
          "env": { "API_KEY": "<YOUR_API_KEY>" }
        }
      }
    }
    ```
  </Tab>
  <Tab title="JetBrains IDEs">
    Go to **Settings \> Tools \> AI Assistant \> Model Context Protocol (MCP)** and add:

    ```json
    {
      "mcpServers": {
        "birdeye-mcp": {
          "command": "npx",
          "args": ["-y", "mcp-remote@0.1.38", "https://mcp.birdeye.so/mcp", "--header", "x-api-key:${API_KEY}"],
          "env": { "API_KEY": "<YOUR_API_KEY>" }
        }
      }
    }
    ```

    Requires JetBrains IDE 2025.1\+ with the MCP Server plugin, or 2025.2\+ which has built in MCP support.
  </Tab>
  <Tab title="Continue">
    Add to `~/.continue/config.yaml`, or through the Continue settings UI:

    ```json
    {
      "mcpServers": {
        "birdeye-mcp": {
          "command": "npx",
          "args": ["-y", "mcp-remote@0.1.38", "https://mcp.birdeye.so/mcp", "--header", "x-api-key:${API_KEY}"],
          "env": { "API_KEY": "<YOUR_API_KEY>" }
        }
      }
    }
    ```
  </Tab>
  <Tab title="Zed">
    Open Zed settings and add to the `context_servers` section:

    ```json
    {
      "context_servers": {
        "birdeye-mcp": {
          "command": {
            "path": "npx",
            "args": ["-y", "mcp-remote@0.1.38", "https://mcp.birdeye.so/mcp", "--header", "x-api-key:<YOUR_API_KEY>"]
          }
        }
      }
    }
    ```
  </Tab>
</Tabs>

Any other MCP compatible tool can connect using the same `command`, `args`, and header pattern shown above.

## Convert MCP into a skill (OpenClaw)

If your runtime is OpenClaw or Hermes rather than a standard MCP client, you can convert the Birdeye MCP server into a skill definition instead of connecting to it directly.

<Steps>
  <Step title="Install Node.js and npm">
    ```bash
    node -v
    npm -v
    ```

    If these are missing, install with `sudo apt install -y nodejs npm` on Ubuntu or Debian, `brew install node` on macOS, or the installer from [nodejs.org](https://nodejs.org/) on Windows.
  </Step>
  <Step title="Run the conversion">
    ```bash
    npx @filiksyos/mcptoskill https://mcp.birdeye.so/mcp --header "x-api-key: <YOUR_API_KEY>" --name=birdeye
    ```
  </Step>
  <Step title="Complete the interactive setup">
    If prompted for a Bearer token, any placeholder value works. When asked to choose a target runtime, select either `openclaw` or `hermes`.
  </Step>
</Steps>

This generates a skill definition for the `birdeye` MCP server that your selected runtime can use directly.

## Next steps

<CardGroup cols={2}>
  <Card title="Tool Catalog" icon="list" href="/agents/tool-catalog">
    See every endpoint exposed through Birdeye MCP, organized by task.
  </Card>

  <Card title="x402 and Agentic Payments" icon="coins" href="/agents/x402-agentic-payments">
    Skip the API key entirely and let your agent pay per request.
  </Card>
</CardGroup>
