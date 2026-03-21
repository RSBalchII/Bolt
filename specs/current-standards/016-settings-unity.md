# Standard 016: Settings Unity

**Effective:** 2026-03-21  
**Status:** Active  
**Supersedes:** None (New standard from P0 fixes)

---

## Purpose

Establish single source of truth for all configuration via `user_settings.json`.

---

## Specification

### Requirement 1: Shared Settings File
All components **SHALL** read configuration from shared `user_settings.json`.

**Components:**
- Anchor Engine
- MCP Server
- Watchdog Service
- CLI Commands

### Requirement 2: No Environment Variables Required
The system **SHALL** function without requiring environment variables.

**Environment variables MAY override settings for backward compatibility.**

### Requirement 3: Settings Structure
The settings file **SHALL** include:

```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 3161,
    "api_key": "bolt-memory-secret"
  },
  "watcher": {
    "debounce_ms": 2000,
    "stability_threshold_ms": 2000,
    "extra_paths": [
      "/path/to/watch"
    ]
  },
  "database": {
    "wipe_on_startup": false
  },
  "mcp": {
    "enabled": true,
    "rate_limit_requests_per_minute": 120,
    "max_query_results": 100,
    "allowed_operations": ["query", "read_file", "get_stats"]
  }
}
```

### Requirement 4: MCP Server Integration
MCP server **SHALL** read API key and URL from settings file.

**Implementation:**
```typescript
// Load from settings
const settings = JSON.parse(readFileSync('user_settings.json', 'utf8'));
const apiKey = settings.server.api_key;
const apiUrl = `http://localhost:${settings.server.port}`;

// Environment variables override (backward compatibility)
const ANCHOR_API_KEY = process.env.ANCHOR_API_KEY || apiKey;
const ANCHOR_API_URL = process.env.ANCHOR_API_URL || apiUrl;
```

---

## Examples

### MCP Server Startup (No Env Vars)
```bash
# Before (required env vars):
ANCHOR_API_URL=http://localhost:3161 \
ANCHOR_API_KEY=bolt-memory-secret \
node mcp-server/dist/index.js

# After (reads from settings):
node mcp-server/dist/index.js
# ✅ Automatically loads from user_settings.json
```

### Startup Message
```
✅ MCP: Loaded settings from user_settings.json
   Engine URL: http://localhost:3161
   API Key: set (bolt-mem...)
   Source: user_settings.json
   MCP Enabled: ✅
```

---

## Compliance

- [x] MCP server reads from `user_settings.json`
- [x] Engine reads from `user_settings.json`
- [x] Environment variables still override (backward compatible)
- [x] Clear startup messages show config source

---

## History

- **v4.8.2** (2026-03-21): Initial release as Standard 016
- **Implementation:** P0 Critical Fix #4

---

## References

- [FRICTIONLESS_SPEC.md §5](../FRICTIONLESS_SPEC.md#5-mcp-server-that-just-works)
- [PAIN_POINTS_DOCUMENTATION.md #8](../PAIN_POINTS_DOCUMENTATION.md#8-mcp-server-auth-configuration)
- [MCP_AGENT_SETUP.md](../MCP_AGENT_SETUP.md)
