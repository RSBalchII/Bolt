# ⚡ Bolt Memory - Quick Setup for Qwen Code Sessions

**Automatic ingestion of Qwen chat logs for persistent AI memory**

---

## 🔧 Configuration

Bolt Memory uses the **same `user_settings.json`** as Anchor Engine Node. This ensures:
- Consistent settings across all instances
- Single source of truth for configuration
- Easy maintenance

**Location:** `/data/data/com.termux/files/home/projects/anchor-engine-node/user_settings.json`

---

## 📋 Watcher Configuration

The **watcher** automatically ingests Qwen chat logs as they're created:

```json
{
  "watcher": {
    "debounce_ms": 2000,
    "stability_threshold_ms": 2000,
    "extra_paths": [
      "/data/data/com.termux/files/home/.qwen/projects/-data-data-com-termux-files-home/chats"
    ]
  }
}
```

### **What This Does:**
- Monitors your Qwen Code chat directory
- Automatically ingests new messages within 2 seconds
- No manual copying or ingestion needed
- Works for ALL Qwen sessions

### **For Other Agents:**

Add your agent's chat directory to `extra_paths`:

```json
{
  "watcher": {
    "extra_paths": [
      "/data/data/com.termux/files/home/.qwen/projects/-data-data-com-termux-files-home/chats",
      "/path/to/claude/chat/logs",
      "/path/to/cursor/chat/history"
    ]
  }
}
```

---

## 🚀 First-Time Setup

### **1. Enable Wipe on Startup** (for fresh database)

Edit `user_settings.json`:
```json
{
  "database": {
    "wipe_on_startup": true
  }
}
```

### **2. Start Anchor Engine**

```bash
cd /data/data/com.termux/files/home/projects/anchor-engine-node
node --expose-gc --max-old-space-size=2048 engine/dist/index.js start
```

### **3. Start MCP Server**

```bash
ANCHOR_API_URL=http://localhost:3161 \
ANCHOR_API_KEY=bolt-memory-secret \
node /data/data/com.termux/files/home/projects/anchor-engine-node/mcp-server/dist/index.js
```

### **4. Configure Qwen Code**

Copy MCP config:
```bash
cp /data/data/com.termux/files/home/projects/anchor-engine-node/qwen-mcp-config.json \
   /data/data/com.termux/files/home/.qwen/mcp.json
```

### **5. Restart Qwen Code**

Qwen will now:
- Auto-detect the MCP server
- Have access to all chat history
- Automatically ingest new conversations

---

## 🔄 Ongoing Use

**No action needed!** The watcher handles everything:

1. You chat with Qwen Code
2. Chat logs saved to `.qwen/projects/.../chats/*.jsonl`
3. Watcher detects new files (2 second debounce)
4. Automatic ingestion into Anchor Engine
5. MCP server has instant access to new memories

---

## 📊 Verify Ingestion

```bash
# Check database stats
curl http://localhost:3161/v1/stats -H "Authorization: Bearer bolt-memory-secret"

# Test search
curl -X POST http://localhost:3161/v1/memory/search \
  -H "Authorization: Bearer bolt-memory-secret" \
  -H "Content-Type: application/json" \
  -d '{"query": "what did we discuss", "token_budget": 1024}'
```

---

## 🛠️ Troubleshooting

### **Watcher Not Ingesting?**

Check logs:
```bash
tail -100 /data/data/com.termux/files/home/projects/anchor-engine-node/logs/anchor_engine.log.* | grep -i watcher
```

### **Manual Ingest**

If needed, trigger manually:
```bash
curl -X POST http://localhost:3161/v1/watchdog/ingest \
  -H "Authorization: Bearer bolt-memory-secret" \
  -H "Content-Type: application/json" \
  -d '{"path": "/data/data/com.termux/files/home/.qwen/projects/-data-data-com-termux-files-home/chats"}'
```

### **Reset Database**

1. Set `wipe_on_startup: true`
2. Restart engine
3. Set back to `false` after first run

---

## 📁 Key Paths

| Component | Path |
|-----------|------|
| **Settings** | `../anchor-engine-node/user_settings.json` (symlinked) |
| **Qwen Chats** | `~/.qwen/projects/-data-data-com-termux-files-home/chats/` |
| **Database** | `../anchor-engine-node/engine/context_data/` |
| **MCP Server** | `../anchor-engine-node/mcp-server/dist/index.js` |
| **Logs** | `../anchor-engine-node/logs/anchor_engine.log.*` |

---

**Created:** 2026-03-21  
**Status:** ✅ Automatic ingestion enabled
