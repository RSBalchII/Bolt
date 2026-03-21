# Continue.dev Integration

This guide explains how to integrate Anchor Engine with Continue.dev for persistent memory in your IDE.

## Prerequisites

- [Continue.dev](https://continue.dev/) extension installed in your IDE
- [Anchor Engine](https://github.com/RSBalchII/anchor-engine-node) installed and running

## Quick Setup

### 1. Install Anchor Engine

```bash
npm install -g @rbalchii/anchor-engine
anchor init
anchor start
```

### 2. Add Continue.dev to Watched Paths

Using the CLI:

```bash
anchor agents add continue
```

Or manually edit `user_settings.json`:

```json
{
  "watcher": {
    "extra_paths": [
      "~/.continue/chats"
    ]
  }
}
```

### 3. Configure Continue.dev

Continue.dev uses a `config.json` file for configuration.

**Location:**

| OS | Path |
|----|------|
| **Linux/macOS** | `~/.continue/config.json` |
| **Windows** | `%USERPROFILE%\.continue\config.json` |

Add a custom context provider:

```json
{
  "contextProviders": [
    {
      "name": "anchor",
      "params": {
        "url": "http://localhost:3161",
        "apiKey": "your-api-key"
      }
    }
  ]
}
```

### 4. MCP Integration (Optional)

For full MCP support, add to your Continue config:

```json
{
  "experimental": {
    "modelContextProtocolServers": [
      {
        "name": "anchor",
        "transport": {
          "type": "stdio",
          "command": "node",
          "args": ["/path/to/anchor-engine-node/mcp-server/dist/index.js"]
        },
        "env": {
          "ANCHOR_API_URL": "http://localhost:3161",
          "ANCHOR_API_KEY": "your-api-key"
        }
      }
    ]
  }
}
```

## Chat Directory Locations

Continue.dev stores chat history in:

| OS | Path |
|----|------|
| **Linux/macOS** | `~/.continue/chats/` |
| **Windows** | `%USERPROFILE%\.continue\chats\` |

## Usage in Continue.dev

### Using @anchor Context

In Continue's chat, reference your memory:

```
@anchor What was the decision about the database schema?
```

### Storing Information

```
Remember: The payment service uses Stripe with webhook endpoints at /api/webhooks/stripe
```

### Code Search

```
@anchor Find all usages of the authenticate middleware
```

## Available Tools

When using MCP integration:

| Tool | Description |
|------|-------------|
| `anchor_query` | Search memory for code, decisions, documentation |
| `anchor_distill` | Create compressed knowledge summary |
| `anchor_illuminate` | Explore related concepts |
| `anchor_ingest_text` | Store new information |
| `anchor_ingest_file` | Ingest files into memory |

## IDE Support

Continue.dev works with:

- **VS Code** - Full support
- **JetBrains IDEs** - Full support (IntelliJ, PyCharm, etc.)
- **Neovim** - Via continue.nvim
- **Emacs** - Via continue.el

## Example Workflows

### 1. Project Onboarding

```
@anchor Summarize the architecture of this project
```

Anchor will search your memory for previous discussions about the project architecture.

### 2. Debugging Context

```
@anchor What was the fix for the CORS error?
```

### 3. Code Review Memory

```
Remember: PR #142 introduced the rate limiting middleware. Key files: src/middleware/rateLimit.ts
```

## Troubleshooting

### Context Provider Not Working

1. Verify Anchor Engine is running: `anchor status`
2. Check the API URL and key in config.json
3. Restart your IDE after config changes

### Chats Not Being Ingested

1. Verify the chat directory path
2. Check watchdog status: `anchor status`
3. Trigger manual ingestion: `anchor ingest start`

### MCP Server Not Loading

1. Verify Node.js path is correct
2. Check MCP server builds: `cd mcp-server && npm run build`
3. Look for errors in Continue's output panel

## Configuration Reference

### Full Example config.json

```json
{
  "models": [
    {
      "title": "GPT-4",
      "provider": "openai",
      "model": "gpt-4"
    }
  ],
  "contextProviders": [
    {
      "name": "anchor",
      "params": {
        "url": "http://localhost:3161",
        "apiKey": "your-api-key"
      }
    }
  ],
  "experimental": {
    "modelContextProtocolServers": [
      {
        "name": "anchor",
        "transport": {
          "type": "stdio",
          "command": "node",
          "args": ["/path/to/anchor-engine-node/mcp-server/dist/index.js"]
        },
        "env": {
          "ANCHOR_API_URL": "http://localhost:3161",
          "ANCHOR_API_KEY": "your-api-key"
        }
      }
    ]
  }
}
```

## Related Documentation

- [Claude Desktop Integration](./claude-desktop.md)
- [Cursor Integration](./cursor.md)
- [Qwen Code Integration](./qwen-code.md)
- [API Reference](../api-reference/API.md)