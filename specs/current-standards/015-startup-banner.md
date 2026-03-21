# Standard 015: Startup Banner

**Effective:** 2026-03-21  
**Status:** Active  
**Supersedes:** None (New standard from P0 fixes)

---

## Purpose

Provide clear visual confirmation of system status on engine startup.

---

## Specification

### Requirement 1: Banner Display
The engine **SHALL** display a status banner on successful startup.

**Banner Format:**
```
⚓ Anchor Engine v4.8.2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Database: 30,922 atoms (or: fresh (ready for ingestion))
✅ Watchdog: active, watching N path(s)
   • /path/to/watch/1
   • /path/to/watch/2
✅ MCP server: ready on stdio
✅ API key: set (first-8-chars...)
✅ Health: http://localhost:3161/health
⏱️  Startup complete in 7.4s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Requirement 2: Status Items
The banner **SHALL** include:
- Database stats (atom count or "fresh")
- Watchdog status and watched paths
- MCP server status
- API key status (masked for security)
- Health endpoint URL
- Startup time

### Requirement 3: Error Handling
If banner display fails, the engine **SHALL** still start but log a warning.

---

## Examples

### Fresh Database
```
⚓ Anchor Engine v4.8.2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Database: fresh (ready for ingestion)
✅ Watchdog: active, watching 1 path(s)
   • /data/data/com.termux/files/home/.qwen/projects/.../chats
✅ MCP server: ready on stdio
✅ API key: set (bolt-mem...)
✅ Health: http://0.0.0.0:3161/health
⏱️  Startup complete in 21.3s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### With Existing Data
```
⚓ Anchor Engine v4.8.2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Database: 151,515 atoms, 1,234 sources, 4,567 tags
✅ Watchdog: active, watching 2 path(s)
   • /path/to/qwen/chats
   • /path/to/claude/chats
✅ MCP server: ready on stdio
✅ API key: set (my-api-k...)
✅ Health: http://localhost:3161/health
⏱️  Startup complete in 8.2s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Implementation

- **File:** `engine/src/utils/startup-banner.ts`
- **Function:** `displayStartupBanner()`
- **Called from:** `engine/src/index.ts` after all services initialized

---

## Compliance

- [x] Banner utility created: `startup-banner.ts`
- [x] Integrated into startup sequence
- [x] All status items displayed
- [x] Number formatting (commas for large numbers)
- [x] API key masking (first 8 chars + ellipsis)

---

## History

- **v4.8.2** (2026-03-21): Initial release as Standard 015
- **Implementation:** P0 Critical Fix #3

---

## References

- [FRICTIONLESS_SPEC.md §1.3](../FRICTIONLESS_SPEC.md#13-startup-status-banner)
- [PAIN_POINTS_DOCUMENTATION.md #6](../PAIN_POINTS_DOCUMENTATION.md#6-engine-startup-failures-silently)
