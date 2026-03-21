# Cursor Integration

This guide explains how to integrate Anchor Engine with Cursor IDE for persistent memory across coding sessions.

## Prerequisites

- [Cursor](https://cursor.sh/) installed
- [Anchor Engine](https://github.com/RSBalchII/anchor-engine-node) installed and running

## Quick Setup

### 1. Install Anchor Engine

```bash
npm install -g @rbalchii/anchor-engine
anchor init
anchor start
```

### 2. Add Cursor to Watched Paths

Using the CLI:

```bash
anchor agents add cursor
```

Or manually edit `user_settings.json`:

```json
{
  "watcher": {
    "extra_paths": [
      "~/.cursor/chats"
    ]
  }
}
```

### 3. Configure MCP Server

Cursor supports MCP through its settings. Configure it to connect to Anchor Engine.

**Cursor Settings:**

1. Open Cursor Settings (Cmd/Ctrl + Shift + J)
2. Navigate to "Features" → "Model Context Protocol"
3. Add a new MCP server:

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

### 4. Restart Cursor

Reload the window or restart Cursor to load the MCP server.

## Chat Directory Locations

Cursor stores chat history in:

| OS | Path |
|----|------|
| **Linux/macOS** | `~/.cursor/chats/` |
| **Windows** | `%APPDATA%\Cursor\chats\` |

## Usage in Cursor

Once configured, you can use Anchor Engine memory in Cursor:

### Code Context

```
You: What was the architecture decision for the auth module?

Cursor: [Uses anchor_query to search memory]
Based on previous discussions, the auth module uses...
```

### Project Memory

```
You: Remember that the API rate limit is 100 req/min

Cursor: [Uses anchor_ingest_text to store this]
I've stored that information in memory.
```

### Debugging History

```
You: How did we fix the database connection issue?

Cursor: [Searches memory for related debugging sessions]
We fixed it by adding connection pooling...
```

## Available MCP Tools

| Tool | Description |
|------|-------------|
| `anchor_query` | Search memory for code patterns, decisions, discussions |
| `anchor_distill` | Create compressed summary of project knowledge |
| `anchor_illuminate` | Explore related concepts in codebase |
| `anchor_ingest_text` | Store new information (decisions, patterns, notes) |
| `anchor_ingest_file` | Ingest documentation or code files |

## Best Practices

### 1. Store Architecture Decisions

When making important design choices:

```
Remember: We chose PostgreSQL over MongoDB because we need ACID transactions for financial data.
```

### 2. Track Bug Fixes

```
Remember: The memory leak in worker.ts was caused by unclosed event listeners. Fix: call cleanup() on shutdown.
```

### 3. Save API Patterns

```
Remember: All API endpoints follow the pattern /v1/resource/action with JWT auth in the Authorization header.
```

## Troubleshooting

### MCP Not Available in Cursor

1. Verify MCP is enabled in Cursor settings
2. Check the MCP server path is absolute
3. Ensure Node.js is in your PATH
4. Check Cursor's developer console for errors

### Chats Not Being Ingested

1. Verify the chat directory exists
2. Check watchdog status: `anchor status`
3. Manually trigger: `anchor ingest start`

### Memory Not Returning Results

1. Verify ingestion completed
2. Use specific search terms
3. Try debug mode: `anchor search "query" --debug`

## Related Documentation

- [Claude Desktop Integration](./claude-desktop.md)
- [Qwen Code Integration](./qwen-code.md)
- [Continue.dev Integration](./continue.md)
- [API Reference](../api-reference/API.md)