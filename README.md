# ⚡ Bolt Memory

**Persistent AI Memory for Qwen Code on Android/Termux**

[![npm version](https://img.shields.io/npm/v/@rbalchii/anchor-engine.svg)](https://www.npmjs.com/package/@rbalchii/anchor-engine)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 30-Second Quick Start

```bash
# Install
npm install -g @rbalchii/anchor-engine

# Initialize (auto-detects Qwen Code)
anchor init

# Start engine
anchor start

# That's it! Your Qwen chats are now being ingested automatically.
```

---

## 📋 What is Bolt Memory?

**Bolt Memory** is a pre-configured instance of [Anchor Engine](https://github.com/RSBalchII/anchor-engine-node) optimized for **Qwen Code on Android/Termux**.

It provides:
- ✅ **Automatic chat ingestion** - Your Qwen conversations are indexed as you chat
- ✅ **Persistent memory** - Search across all past sessions instantly
- ✅ **MCP server integration** - Qwen Code can query your memory via tools
- ✅ **Zero configuration** - Settings shared automatically, no env vars needed

### **Use Cases**

1. **Context Preservation** - Qwen remembers what you discussed weeks ago
2. **Code Reference** - "Show me that React component we built last month"
3. **Decision Tracking** - "Why did we choose PostgreSQL over MongoDB?"
4. **Learning Assistant** - "What concepts did I struggle with last week?"

---

## 🎯 Key Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Auto-Ingestion** | Qwen chats indexed within 2 seconds | ✅ Active |
| **MCP Integration** | Qwen can search memory via tools | ✅ Active |
| **Shared Settings** | Single `user_settings.json` for all config | ✅ Active |
| **Recursive Search** | 6-level fallback ensures results | ✅ Active |
| **Watchdog Service** | Monitors chat directory continuously | ✅ Auto-enabled |
| **Startup Banner** | Clear status on engine start | ✅ Active |

---

## 📦 Installation

### **Prerequisites**

- Android device with **Termux** installed
- Node.js 20+ (`pkg install nodejs-lts`)
- Qwen Code installed in Termux

### **Step-by-Step**

```bash
# 1. Install dependencies
pkg install nodejs-lts python clang llvm lld

# 2. Install Bolt Memory
npm install -g @rbalchii/anchor-engine

# 3. Initialize (creates config, detects Qwen)
anchor init

# 4. Start engine
anchor start
```

**Output:**
```
⚓ Anchor Engine v4.8.2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Database: fresh (ready for ingestion)
✅ Watchdog: active, watching 1 path(s)
   • /data/data/com.termux/files/home/.qwen/projects/.../chats
✅ MCP server: ready on stdio
✅ API key: set (bolt-mem...)
✅ Health: http://localhost:3161/health
⏱️  Startup complete in 7.4s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔧 Configuration

### **Single Settings File**

All configuration lives in `user_settings.json`:

```json
{
  "server": {
    "port": 3161,
    "api_key": "bolt-memory-secret"
  },
  "watcher": {
    "extra_paths": [
      "/data/data/com.termux/files/home/.qwen/projects/-data-data-com-termux-files-home/chats"
    ]
  },
  "database": {
    "wipe_on_startup": false
  },
  "mcp": {
    "enabled": true,
    "rate_limit_requests_per_minute": 120
  }
}
```

**No environment variables needed!** MCP server reads from this file automatically.

### **Common Configurations**

#### **Enable Auto-Wipe (Fresh Start)**
```json
{
  "database": {
    "wipe_on_startup": true
  }
}
```

#### **Add More Chat Sources**
```json
{
  "watcher": {
    "extra_paths": [
      "/path/to/qwen/chats",
      "/path/to/claude/chats",
      "/path/to/cursor/chats"
    ]
  }
}
```

#### **Adjust Search Strategy**
```json
{
  "search": {
    "strategy": "hybrid",
    "fallback_enabled": true,
    "min_results_before_fallback": 5
  }
}
```

---

## 🛠️ CLI Commands

```bash
# Check system status
anchor status

# Search memory
anchor search "android binary build"

# Add watched path
anchor watch add ~/.qwen/projects/.../chats

# List watched paths
anchor watch list

# Trigger manual ingestion
anchor ingest /path/to/chats

# View logs
anchor logs --tail 50

# Health check
anchor health
```

---

## 🔍 Search Examples

### **Basic Search**
```bash
anchor search "MCP authentication fix"
```

### **Debug Mode (Shows Why Results Matched)**
```bash
anchor search "android build" --debug
```

**Output:**
```
📊 Found 12 results (0.15s)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1] Score: 0.94 | session-6a85a0d4 | 2026-03-07
    "The Android binary build plan includes 5 phases:
     1. Fix GitHub authentication
     2. Build native modules for arm64-android
     ..."

🔍 Debug Info:
   Query tags: ["android", "termux", "build"]
   FTS matches: 45 atoms
   Graph matches: 12 molecules
   Rejected by score: 33 atoms (score < 0.5)
```

### **Max-Recall Strategy (Broadest Search)**
```bash
anchor search "consciousness emergence" --strategy max-recall
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[docs/INDEX.md](docs/INDEX.md)** | Complete documentation hub |
| **[docs/quick-start.md](docs/quick-start.md)** | Simplified getting started |
| **[docs/user-guide/qwen-integration.md](docs/user-guide/qwen-integration.md)** | Qwen-specific setup |
| **[docs/user-guide/mcp-setup.md](docs/user-guide/mcp-setup.md)** | MCP server configuration |
| **[docs/api-reference/API.md](docs/api-reference/API.md)** | Complete API reference |
| **[docs/architecture/standards/](docs/architecture/standards/)** | All active standards |
| **[RECURSIVE_SEARCH_FALLBACKS.md](RECURSIVE_SEARCH_FALLBACKS.md)** | Search strategy explained |
| **[PAIN_POINTS_DOCUMENTATION.md](PAIN_POINTS_DOCUMENTATION.md)** | Known issues & fixes |
| **[FRICTIONLESS_SPEC.md](FRICTIONLESS_SPEC.md)** | Future improvements spec |

---

## 🧩 Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Qwen Code (AI Agent)                │
│                    MCP Client                        │
└────────────────────┬────────────────────────────────┘
                     │ MCP Protocol (stdio)
┌────────────────────▼────────────────────────────────┐
│          anchor-mcp (MCP Server)                    │
│  - Reads settings from user_settings.json           │
│  - No environment variables needed                  │
└────────────────────┬────────────────────────────────┘
                     │ HTTP API (localhost:3161)
┌────────────────────▼────────────────────────────────┐
│          Anchor Engine Core                         │
│  ┌──────────────────────────────────────────────┐   │
│  │  Watchdog Service (Auto-Enabled)             │   │
│  │  - Monitors ~/.qwen/projects/.../chats       │   │
│  │  - Auto-ingests new files within 2s          │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │  Search Engine (6-Level Fallback)            │   │
│  │  - Engram → Primary → OR-Fuzzy → Tag-Aware   │   │
│  │  - → Molecule → Max-Recall                   │   │
│  │  - Physics Tag Walker (recursive expansion)  │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │  PGlite Database (Embedded SQLite)           │   │
│  │  - Atoms, Molecules, Tags, Engrams           │   │
│  │  - FTS indexes, GIN indexes                  │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Standards

Bolt Memory follows the **Anchor Engine Standards** hierarchy:

### **Active Standards** (specs/current-standards/)
| # | Title | Purpose |
|---|-------|---------|
| 001 | Atomic Decomposition | Content chunking strategy |
| 002 | Tag Derivation | Semantic tagging |
| 003 | Molecular Binding | Related atom grouping |
| 004 | Engram Formation | Cached search results |
| 005 | Physics Tag Walker | Graph traversal algorithm |
| 006 | Radial Distillation | Knowledge compression |
| 007 | Mirror Protocol | File system reflection |
| 008 | Backup & Restore | Data persistence |
| 009 | Health Monitoring | System observability |
| 010 | MCP Integration | Agent protocol |

### **Recent Standards** (specs/archive-standards/)
| # | Title | Purpose |
|---|-------|---------|
| 136 | Streaming Search | SSE-based results |
| 135 | Watchdog Auto-Enable | Zero-conf ingestion |
| 134 | Settings Unity | Single config file |
| 133 | Startup Banner | Clear status display |
| 132 | Search Content Return | Include content in results |

---

## 🐛 Troubleshooting

### **Engine Won't Start**
```bash
# Check if port is in use
netstat -tlnp | grep 3161

# Kill existing process
pkill -f "node.*engine/dist"

# Restart
anchor start
```

### **No Results from Search**
```bash
# Check database stats
curl http://localhost:3161/v1/stats

# If 0 atoms, trigger ingestion
anchor ingest ~/.qwen/projects/.../chats

# Wait 30 seconds, check again
anchor status
```

### **Watchdog Not Running**
```bash
# Check status
curl http://localhost:3161/v1/watchdog/status

# Manually start
curl -X POST http://localhost:3161/v1/watchdog/start \
  -H "Authorization: Bearer bolt-memory-secret"
```

### **MCP Server Not Connecting**
```bash
# Verify MCP enabled in settings
cat user_settings.json | grep -A5 '"mcp"'

# Restart MCP
pkill -f "mcp-server"
anchor mcp start
```

**Full troubleshooting guide:** [docs/troubleshooting.md](docs/troubleshooting.md)

---

## 📊 Performance

| Metric | Value | Notes |
|--------|-------|-------|
| **Startup Time** | 7-10s | Fresh database |
| **Ingestion Speed** | ~1000 atoms/sec | JSONL format |
| **Search Latency** | 50-300ms | Standard strategy |
| **Max-Recall Search** | 500-2000ms | Broadest search |
| **Memory Usage** | 500MB-2GB | Depends on corpus size |
| **Database Size** | ~100MB per 10K atoms | Compressed |

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

**Guidelines:** [CONTRIBUTING.md](CONTRIBUTING.md)  
**Code of Conduct:** [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

---

## 📝 Changelog

### **v4.8.2** (2026-03-21)
- ✅ **P0 Critical Fixes Complete**
  - Watchdog auto-enable when `extra_paths` configured
  - Search returns actual content (not just metadata)
  - Startup status banner with system health
  - MCP server reads settings from `user_settings.json`
- ✅ **Documentation**
  - Recursive search fallbacks documented
  - Pain points analysis (12 issues, 11+ hours saved)
  - Frictionless experience specification
- ✅ **Standards**
  - Standard 135: Watchdog Auto-Enable
  - Standard 134: Settings Unity
  - Standard 133: Startup Banner
  - Standard 132: Search Content Return

**Full changelog:** [CHANGELOG.md](CHANGELOG.md)

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

- **Qwen Code** - AI agent integration
- **Anchor Engine** - Core memory infrastructure
- **STAR Algorithm** - Semantic retrieval
- **PGlite** - Embedded PostgreSQL

---

**Last Updated:** 2026-03-21  
**Version:** 4.8.2  
**Maintainer:** @rbalchii
