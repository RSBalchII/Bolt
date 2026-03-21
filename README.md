# ⚡ Bolt Memory

**Persistent AI Memory with Model-Agnostic Orchestration**

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Anchor Engine](https://img.shields.io/badge/Powered%20by-Anchor%20Engine-v4.8.2-green)](https://github.com/RSBalchII/anchor-engine-node)

---

## 🎯 What is Bolt Memory?

Bolt Memory is a **persistent memory system for AI agents** that:

- ✅ Remembers conversations, decisions, and context across sessions
- ✅ Works with any LLM (llama.cpp, Ollama, LM Studio, OpenAI APIs)
- ✅ Provides semantic search over your conversation history
- ✅ Creates checkpoint distillations for quick context restoration
- ✅ Runs locally on your device (no cloud dependency)

**Think of it as:** A hippocampus for your AI agents.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd Bolt
pnpm install
```

### 2. Start Bolt Memory

```bash
pnpm start
```

Wait for: `Anchor Context Engine running on 0.0.0.0:3161`

### 3. Verify Health

```bash
curl http://localhost:3161/health
```

Expected: `{"status":"healthy",...}`

### 4. Use the Orchestrator

#### Web UI (Recommended)
Open `orchestrator-ui.html` in your browser, or:

```bash
# Serve the UI
python3 -m http.server 8000
# Navigate to http://localhost:8000/orchestrator-ui.html
```

#### CLI
```bash
# Single task
node orchestrator-v2.js "Help me plan my day"

# Interactive chat
node orchestrator-v2.js --chat
```

---

## 🤖 Supported LLM Providers

| Provider | Type | Setup | Status |
|----------|------|-------|--------|
| **llama.cpp** | Local GGUF | Pre-configured | ✅ Ready |
| **Ollama** | Local | Install from ollama.ai | ⚠️ Optional |
| **LM Studio** | Local | Download from lmstudio.ai | ⚠️ Optional |
| **OpenAI API** | Remote | Add API key to config | ⚠️ Optional |

### Default Model
- **Qwen 3.5 2B Instruct** (GGUF Q4_K_M)
- Location: `/data/data/com.termux/files/home/models/qwen3.5-2b-instruct-q4_k_m.gguf`
- Context: 8192 tokens
- CPU-only (Termux/Android compatible)

---

## 📁 Directory Structure

```
Bolt/
├── engine/                     # Anchor Engine (semantic memory core)
├── local-data/                # Your data (gitignored)
│   ├── inbox/                # Files to ingest
│   ├── external-inbox/       # External content
│   └── mirrored_brain/       # Cleaned mirrors
├── orchestrator-v2.js         # Model-agnostic orchestrator
├── orchestrator-ui.html       # Web UI
├── orchestrator-config.json   # Provider configuration
├── user_settings.json         # Engine configuration
├── ingest-chats.js           # Chat ingestion script
├── BOLT_MEMORY_GUIDE.md      # Complete setup guide
└── ORCHESTRATOR_SETUP.md     # Orchestrator usage
```

---

## 🔧 Configuration

### Edit `orchestrator-config.json`

```json
{
  "orchestrator": {
    "default_provider": "llama_cpp",
    "providers": {
      "llama_cpp": {
        "models": [
          {
            "name": "Qwen 3.5 2B Instruct",
            "path": "/path/to/qwen3.5-2b-instruct-q4_k_m.gguf",
            "default": true
          }
        ]
      }
    }
  }
}
```

### Edit `user_settings.json`

```json
{
  "server": {
    "port": 3161,
    "api_key": "your-secret-key"
  },
  "database": {
    "wipe_on_startup": false
  },
  "ingestion": {
    "concept_density": "high",
    "ingestion_profile": "chat"
  }
}
```

---

## 📊 Features

### Memory Management
- **Semantic Search:** Find relevant context from past conversations
- **Provenance Tracking:** Know where each memory came from
- **Checkpoint Distillation:** Compress sessions into key decisions
- **Persistent Storage:** Survives restarts (when configured)

### Orchestration
- **Model-Agnostic:** Switch between LLM providers seamlessly
- **Auto-Search:** Automatically finds relevant context
- **Auto-Save:** All decisions saved to memory
- **Multi-Provider:** Use different models for different tasks

### UI Features
- **Provider Selection:** Click to switch LLM backends
- **Memory Stats:** Real-time database statistics
- **Task Input:** Describe your task or question
- **Response Display:** Formatted output with auto-save

---

## 🧪 Usage Examples

### Save a Decision
```bash
node orchestrator-v2.js "Decided to use Qwen 3.5 2B for orchestration"
```

### Search Memory
```bash
curl -X POST http://localhost:3161/v1/memory/search \
  -H "Authorization: Bearer your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"query": "orchestration decisions", "token_budget": 2000}'
```

### Create Checkpoint
```bash
curl -X POST http://localhost:3161/v1/memory/distill \
  -H "Authorization: Bearer your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"seed": {"query": "today session"}, "radius": 2}'
```

---

## 📚 Documentation

- **[BOLT_MEMORY_GUIDE.md](./BOLT_MEMORY_GUIDE.md)** - Complete setup and usage guide
- **[ORCHESTRATOR_SETUP.md](./ORCHESTRATOR_SETUP.md)** - Orchestrator configuration
- **[Anchor Engine Docs](https://github.com/RSBalchII/anchor-engine-node)** - Core engine documentation

---

## 🔒 Security

- **API Key Protection:** All endpoints require authentication
- **Local-First:** Runs entirely on your device
- **No Cloud:** Your data never leaves your machine
- **Gitignored Data:** `local-data/` excluded from version control

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

AGPL-3.0 License - See [LICENSE](../LICENSE) for details.

---

## 🙏 Acknowledgments

Built with:
- [Anchor Engine](https://github.com/RSBalchII/anchor-engine-node) - Semantic memory core
- [llama.cpp](https://github.com/ggerganov/llama.cpp) - Local LLM inference
- [Qwen](https://qwenlm.github.io/) - Language models

---

**Created:** 2026-03-20  
**Version:** 1.0.0  
**Status:** Production Ready
