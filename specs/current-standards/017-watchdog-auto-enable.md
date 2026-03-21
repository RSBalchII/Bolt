# Standard 017: Watchdog Auto-Enable

**Effective:** 2026-03-21  
**Status:** Active  
**Supersedes:** None (New standard from P0 fixes)

---

## Purpose

Automatically enable watchdog service when watcher paths are configured.

---

## Specification

### Requirement 1: Auto-Enable on Startup
The watchdog service **SHALL** automatically start if `watcher.extra_paths` is non-empty.

**Implementation:**
```typescript
if (config.WATCHER_EXTRA_PATHS && config.WATCHER_EXTRA_PATHS.length > 0) {
  console.log('[Services] Watchdog: auto-starting due to extra_paths configuration...');
  await startWatchdog();
  console.log('[Services] ✅ Watchdog auto-started successfully');
} else {
  console.log('[Services] Watchdog: disabled (no extra_paths configured)');
}
```

### Requirement 2: Clear Logging
The system **SHALL** log auto-enable status with path details.

**Log Output:**
```
🔍 Watchdog auto-enabled: watching 1 extra path(s)
   • /data/data/com.termux/files/home/.qwen/projects/.../chats
```

### Requirement 3: Manual Override
Users **MAY** still manually start/stop watchdog via API or UI.

**API Endpoints:**
- `POST /v1/watchdog/start` - Manual start
- `POST /v1/watchdog/stop` - Manual stop
- `GET /v1/watchdog/status` - Status check

---

## Examples

### With Extra Paths Configured
```json
{
  "watcher": {
    "extra_paths": [
      "/path/to/qwen/chats"
    ]
  }
}
```

**Result:** Watchdog auto-starts on engine boot

### Without Extra Paths
```json
{
  "watcher": {
    "extra_paths": []
  }
}
```

**Result:** Watchdog remains disabled (can be manually started)

---

## Compliance

- [x] Auto-enable logic in `engine/src/index.ts`
- [x] Logging in `engine/src/services/ingest/watchdog.ts`
- [x] Manual override via API endpoints
- [x] Clear startup messages

---

## History

- **v4.8.2** (2026-03-21): Initial release as Standard 017
- **Implementation:** P0 Critical Fix #1

---

## References

- [FRICTIONLESS_SPEC.md §1.2](../FRICTIONLESS_SPEC.md#12-watchdog-auto-enable)
- [PAIN_POINTS_DOCUMENTATION.md #1](../PAIN_POINTS_DOCUMENTATION.md#1-watchdog-disabled-by-default)
- [MCP_AGENT_SETUP.md](../MCP_AGENT_SETUP.md)
