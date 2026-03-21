# CLI Commands - Bolt Memory

**Version:** 4.9.0  
**Effective:** 2026-03-21

---

## Overview

Bolt Memory CLI provides command-line access to your memory system.

---

## Installation

```bash
# CLI is included with Bolt Memory
# No separate installation needed

# Verify installation
anchor --version
```

---

## Commands

### **anchor status**
Show system status and health.

```bash
anchor status
```

**Output:**
```
⚓ Bolt Memory Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: ✅ healthy
Database: 151,515 atoms, 1,234 sources, 4,567 tags
Watchdog: ✅ Active (3 paths)
   • /data/data/com.termux/files/home/.qwen/projects/.../chats
   • /path/to/claude/chats
   • /path/to/cursor/chats
MCP Server: ✅ Running (stdio)
Uptime: 127m
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### **anchor search <query>**
Search memory with content results.

```bash
# Basic search
anchor search "android binary build"

# With debug info
anchor search "android build" --debug

# Limit results
anchor search "MCP auth" --max-results 10

# Use max-recall strategy
anchor search "obscure topic" --strategy max-recall
```

**Output:**
```
📊 Found 12 results (152ms)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1] Score: 0.94 | qwen-session-6a85a0d4
    "The Android binary build plan includes 5 phases:
     1. Fix GitHub authentication
     2. Build native modules for arm64-android
     ..."
    Tags: #android, #binary, #build
    Date: 3/7/2026

[2] Score: 0.87 | qwen-session-236d683f
    "pnpm build typescript compile..."
    Tags: #typescript, #build
    Date: 3/10/2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Options:**
- `--debug` - Show debug information (query tags, strategy, etc.)
- `--max-results <number>` - Maximum results (default: 20)
- `--strategy <strategy>` - Search strategy: `standard` or `max-recall`

---

### **anchor watch add <path>**
Add a path to watch for automatic ingestion.

```bash
# Add Claude Desktop chats
anchor watch add ~/.config/Claude/chats

# Add Cursor chats
anchor watch add ~/.cursor/chats
```

**Output:**
```
✅ Added to watcher: /home/user/.config/Claude/chats
⚠️  Settings file update not implemented in CLI yet - manual edit required
✅ Watchdog restarted
```

**Note:** Currently requires manual settings file edit. Full implementation coming in v4.9.1.

---

### **anchor watch list**
List all watched paths.

```bash
anchor watch list
```

**Output:**
```
📁 Watched Paths:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. /data/data/com.termux/files/home/.qwen/projects/.../chats
2. /home/user/.config/Claude/chats
3. /home/user/.cursor/chats
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Configured in settings: 3 path(s)
   • /data/data/com.termux/files/home/.qwen/projects/.../chats
   • /home/user/.config/Claude/chats
   • /home/user/.cursor/chats
```

---

### **anchor config**
Show current configuration from `user_settings.json`.

```bash
anchor config
```

**Output:**
```
⚙️  Configuration (user_settings.json)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Server Port: 3161
API Key: set (bolt-mem...)
Watched Paths: 3
   • /data/data/com.termux/files/home/.qwen/projects/.../chats
   • /home/user/.config/Claude/chats
   • /home/user/.cursor/chats
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### **anchor agents discover**
Discover agent chat directories on your system.

```bash
anchor agents discover
```

**Output:**
```
🔍 Discovering agent chat directories...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Found: Qwen Code
   Path: /data/data/com.termux/files/home/.qwen/projects/.../chats
   Sessions: 19 .jsonl files
   Watched: ✅ Yes

✅ Found: Claude Desktop
   Path: /home/user/.config/Claude/chats
   Sessions: 5 .jsonl files
   Watched: ❌ No
   → Add with: anchor agents add claude

✅ Found: Cursor
   Path: /home/user/.cursor/chats
   Sessions: 3 .jsonl files
   Watched: ❌ No
   → Add with: anchor agents add cursor

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Supported Agents:**
- Qwen Code
- Claude Desktop (Linux/macOS)
- Cursor
- Continue.dev

---

### **anchor agents add <agent>**
Add an agent's chat directory to watched paths.

```bash
# Add Qwen (already auto-detected)
anchor agents add qwen

# Add Claude Desktop
anchor agents add claude

# Add Cursor
anchor agents add cursor

# Add Continue.dev
anchor agents add continue
```

**Output:**
```
✅ Added claude chat directory: /home/user/.config/Claude/chats
⚠️  Restart engine to apply changes: anchor-engine restart
```

**Available Agents:**
- `qwen` - Qwen Code
- `claude` - Claude Desktop
- `cursor` - Cursor IDE
- `continue` - Continue.dev

---

### **anchor ingest status**
Check current ingestion progress.

```bash
anchor ingest status
```

**Output:**
```
📁 Ingestion Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: ✅ Active
Current File: qwen-session-abc.jsonl
Processed: 3 / 19 files
Atoms Created: 8,934
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**When Inactive:**
```
📁 Ingestion Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: ⏸️  Inactive (no active ingestion)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Examples

### **Complete Workflow**

```bash
# 1. Check system status
anchor status

# 2. Discover agents
anchor agents discover

# 3. Add Claude Desktop
anchor agents add claude

# 4. Search memory
anchor search "android build plan"

# 5. Check ingestion
anchor ingest status

# 6. View configuration
anchor config
```

### **Debug Search**

```bash
# Search with debug info to understand why results matched
anchor search "MCP authentication" --debug
```

**Debug Output:**
```
📊 Found 8 results (234ms)
...
🔍 Debug Info:
   Query tags: ["MCP", "authentication"]
   Strategy: standard
   Buckets: all
   FTS matches: 12
   Graph matches: 8
```

---

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Error (engine not running, invalid args, etc.) |

---

## Troubleshooting

### **"API error (503): Service Unavailable"**
**Cause:** Engine not running  
**Solution:** `anchor-engine start`

### **"❌ Path not found: /path/to/chats"**
**Cause:** Agent chat directory doesn't exist  
**Solution:** Install the agent first, then add to watcher

### **"⚠️ Settings file update not implemented"**
**Cause:** CLI can't write to settings file yet  
**Solution:** Manually edit `user_settings.json` (full CLI support in v4.9.1)

---

## Implementation Status

| Command | Status | Version |
|---------|--------|---------|
| `anchor status` | ✅ Complete | 4.9.0 |
| `anchor search` | ✅ Complete | 4.9.0 |
| `anchor watch add` | ⚠️ Partial | 4.9.0 |
| `anchor watch list` | ✅ Complete | 4.9.0 |
| `anchor config` | ✅ Complete | 4.9.0 |
| `anchor agents discover` | ✅ Complete | 4.9.0 |
| `anchor agents add` | ✅ Complete | 4.9.0 |
| `anchor ingest status` | ⚠️ Pending API | 4.9.1 |

---

## See Also

- [Quick Start](quick-start.md)
- [Qwen Integration](qwen-integration.md)
- [MCP Setup](mcp-setup.md)
- [API Reference](../api-reference/API.md)
