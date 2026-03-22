# Bolt - AI Orchestrator for Termux

> **Thin wrapper around [Anchor Engine](https://github.com/RSBalchII/anchor-engine-node) for Qwen Code on Termux/Android**

## What is Bolt?

Bolt is a pre-configured instance of Anchor Engine designed for:
- **Qwen Code** integration on Termux/Android
- **Local model orchestration** (coming soon: llama.cpp integration)
- **Zero-config memory** for AI agents

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Bolt (this repo)                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ user_       │  │ local-data/ │  │ Config &    │  │
│  │ settings.   │  │ (inbox,     │  │ Scripts     │  │
│  │ json        │  │ distilled)  │  │             │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
└───────────────────────┬─────────────────────────────┘
                        │ depends on
                        ▼
┌─────────────────────────────────────────────────────┐
│           @rbalchii/anchor-engine (npm)             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ Engine      │  │ MCP Server  │  │ CLI Tools   │  │
│  │ (core)      │  │             │  │             │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Quick Start

```bash
# Install dependencies (ignores native build scripts for Termux)
npm install --ignore-scripts

# Start the engine
npm start

# Engine will be available at http://localhost:3161
```

## Configuration

Edit `user_settings.json` to customize:
- **Server**: Port, API key
- **Watcher**: Paths to watch for chat files
- **LLM**: Model settings (for future local model support)
- **MCP**: Model Context Protocol server settings

## API Endpoints

All Anchor Engine endpoints are available:

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `GET /v1/agent/discover` | Discover installed AI agents |
| `POST /v1/agent/add` | Add agent chat directory |
| `GET /v1/ingest/status` | Ingestion progress |
| `GET /v1/graph/export` | Export knowledge graph |
| `GET /v1/memory/search` | Semantic search |
| `POST /v1/memory/ingest` | Ingest content |

## Directory Structure

```
bolt/
├── package.json          # Depends on @rbalchii/anchor-engine
├── user_settings.json    # Qwen Code configuration
├── local-data/           # User data
│   ├── inbox/           # Files to ingest
│   ├── external-inbox/  # External sources
│   └── distilled/       # Distilled knowledge
└── README.md
```

## Related Projects

- **[anchor-engine-node](https://github.com/RSBalchII/anchor-engine-node)** - Core engine (npm: `@rbalchii/anchor-engine`)
- **[Qwen Code](https://github.com/QwenLM/Qwen-Code)** - AI coding assistant

## License

AGPL-3.0-only