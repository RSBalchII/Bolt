# Claude Desktop Integration

This guide explains how to integrate Anchor Engine with Claude Desktop for persistent memory across conversations.

## Prerequisites

- [Claude Desktop](https://claude.ai/download) installed
- [Anchor Engine](https://github.com/RSBalchII/anchor-engine-node) installed and running

## Quick Setup

### 1. Install Anchor Engine

```bash
npm install -g @rbalchii/anchor-engine
anchor init
anchor start
```

### 2. Add Claude Desktop to Watched Paths

Using the CLI:

```bash
anchor agents add claude
```

Or manually edit `user_settings.json`:

```json
{
  "watcher": {
    "extra_paths": [
      "~/.config/Claude/chats"
    ]
  }
}
```

### 3. Configure MCP Server

Claude Desktop uses MCP (Model Context Protocol) to connect to Anchor Engine.

Edit Claude's MCP configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

**Linux:** `~/.config/Claude/claude_desktop_config.json`

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add the Anchor MCP server:

```json
{
  "mcpServers": {
    "anchor": {
      "command": "node",
      "args": ["/path/to/anchor-engine-node/mcp-server/dist/index.js"],
      "env": {
        "ANCHOR_API_URL": "http://localhost:3161",
        "ANCHOR_API_KEY": "your-api-key"
      }
    }
  }
}
```

### 4. Restart Claude Desktop

Close and reopen Claude Desktop to load the MCP server.

## Chat Directory Locations

Claude Desktop stores chat history in different locations depending on your OS:

| OS | Path |
|----|------|
| **Linux** | `~/.config/Claude/chats/` |
| **macOS** | `~/Library/Application Support/Claude/chats/` |
| **Windows** | `%APPDATA%\Claude\chats\` |

## Available MCP Tools

Once connected, Claude can use these Anchor Engine tools:

| Tool | Description |
|------|-------------|
| `anchor_query` | Search your memory for relevant content |
| `anchor_distill` | Compress corpus into deduplicated summary |
| `anchor_illuminate` | Explore concepts via graph traversal |
| `anchor_ingest_text` | Add new content to memory |
| `anchor_ingest_file` | Ingest a file into memory |

## Usage Example

In Claude Desktop, you can now reference your memory:

```
You: What did we discuss about the API design last week?

Claude: [Uses anchor_query to search memory]
Based on our previous conversations, we discussed...
```

## Troubleshooting

### MCP Server Not Connecting

1. Verify Anchor Engine is running: `anchor status`
2. Check the API key matches in `user_settings.json`
3. Verify the MCP server path is correct
4. Check Claude Desktop logs for errors

### Chats Not Being Ingested

1. Verify the chat directory path is correct
2. Check watchdog is running: `anchor status`
3. Trigger manual ingestion: `anchor ingest start`

### Search Returns No Results

1. Verify atoms exist: `anchor status` should show atoms > 0
2. Check search query is specific enough
3. Try `anchor search "query" --debug` for diagnostics

## Related Documentation

- [Qwen Code Integration](./qwen-code.md)
- [Cursor Integration](./cursor.md)
- [Continue.dev Integration](./continue.md)
- [API Reference](../api-reference/API.md)