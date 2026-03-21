# Qwen Code Integration

This guide explains how to integrate Anchor Engine with Qwen Code for persistent memory across coding sessions.

## Prerequisites

- [Qwen Code](https://github.com/QwenLM/Qwen-Code) installed
- [Anchor Engine](https://github.com/RSBalchII/anchor-engine-node) installed and running

## Quick Setup

### 1. Install Anchor Engine

```bash
npm install -g @rbalchii/anchor-engine
anchor init
anchor start
```

### 2. Add Qwen Code to Watched Paths

Using the CLI:

```bash
anchor agents add qwen
```

Or manually edit `user_settings.json`:

```json
{
  "watcher": {
    "extra_paths": [
      "~/.qwen/projects/-data-data-com-termux-files-home/chats"
    ]
  }
}
```

> **Note:** The exact path depends on your working directory. Use `anchor agents discover` to find the correct path.

### 3. Configure MCP Server

Qwen Code uses MCP (Model Context Protocol) to connect to Anchor Engine.

Edit Qwen Code's settings file:

**Location:** `~/.qwen/settings.json`

Add the MCP server configuration:

```json
{
  "mcp": {
    "servers": {
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
}
```

### 4. Enable MCP in Settings

Ensure MCP is enabled in `user_settings.json`:

```json
{
  "mcp": {
    "enabled": true,
    "allowed_ops": ["query", "distill", "illuminate", "ingest_text", "ingest_file"]
  }
}
```

## Chat Directory Locations

Qwen Code stores chat history in:

| Environment | Path |
|-------------|------|
| **Termux/Android** | `~/.qwen/projects/-data-data-com-termux-files-home/chats/` |
| **Linux/macOS** | `~/.qwen/projects/<project-hash>/chats/` |
| **Windows** | `%USERPROFILE%\.qwen\projects\<project-hash>\chats\` |

Use `anchor agents discover` to find your exact path.

## Available MCP Tools

Once connected, Qwen Code can use these Anchor Engine tools:

| Tool | Description |
|------|-------------|
| `anchor_query` | Search your memory for relevant content |
| `anchor_distill` | Compress corpus into deduplicated summary |
| `anchor_illuminate` | Explore concepts via graph traversal |
| `anchor_read_file` | Read files from the mirrored brain |
| `anchor_list_compounds` | List all source files in memory |
| `anchor_ingest_text` | Add new content to memory |
| `anchor_ingest_file` | Ingest a file into memory |

## Usage Example

In Qwen Code, you can now reference your memory:

```
You: What did we discuss about the API design last week?

Qwen: [Uses anchor_query to search memory]
Based on our previous conversations, we discussed...
```

### Storing Information

```
You: Remember that the database uses PGlite for local storage with a 10MB file limit

Qwen: [Uses anchor_ingest_text to store this]
I've stored that information in your memory.
```

### Exploring Concepts

```
You: What concepts are related to "memory management"?

Qwen: [Uses anchor_illuminate to explore]
Related concepts include: garbage collection, caching, memory pools...
```

## CLI Commands

Use the Anchor CLI for quick operations:

```bash
# Check system status
anchor status

# Search memory
anchor search "API design"

# Discover agents
anchor agents discover

# Add watched path
anchor watch add /path/to/chats

# Export knowledge graph
anchor graph export -o KNOWLEDGE.md
```

## Troubleshooting

### MCP Server Not Connecting

1. Verify Anchor Engine is running: `anchor status`
2. Check the API key matches in `user_settings.json`
3. Verify the MCP server path is correct
4. Check Qwen Code logs for errors

### Chats Not Being Ingested

1. Verify the chat directory path is correct
2. Check watchdog is running: `anchor status`
3. Trigger manual ingestion: `anchor ingest start`

### Search Returns No Results

1. Verify atoms exist: `anchor status` should show atoms > 0
2. Check search query is specific enough
3. Try `anchor search "query" --debug` for diagnostics

### MCP Disabled Error

If you see "🔒 MCP server is disabled":

1. Edit `user_settings.json`
2. Set `mcp.enabled: true`
3. Restart the engine

## Configuration Reference

### user_settings.json Example

```json
{
  "server": {
    "port": 3161,
    "api_key": "your-secret-key"
  },
  "watcher": {
    "extra_paths": [
      "~/.qwen/projects/-data-data-com-termux-files-home/chats"
    ]
  },
  "mcp": {
    "enabled": true,
    "allowed_ops": ["query", "distill", "illuminate", "ingest_text", "ingest_file"]
  },
  "database": {
    "wipe_on_startup": false
  }
}
```

## Related Documentation

- [Claude Desktop Integration](./claude-desktop.md)
- [Cursor Integration](./cursor.md)
- [Continue.dev Integration](./continue.md)
- [API Reference](../api-reference/API.md)
- [Troubleshooting Guide](../TROUBLESHOOTING.md)