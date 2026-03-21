# Standard 018: Streaming Search

**Effective:** 2026-03-21  
**Status:** Active  
**Supersedes:** Standard 136 (reorganized)

---

## Purpose

Provide memory-efficient streaming search results via Server-Sent Events (SSE).

---

## Specification

### Requirement 1: Streaming Default
The search API **SHALL** use streaming mode (SSE) by default.

**SSE Event Types:**
- `metadata` - Search strategy, total results, duration
- `batch` - Batch of results (configurable batch size)
- `error` - Error events
- `complete` - Final completion event

### Requirement 2: Batch Processing
Results **SHALL** be streamed in batches to prevent memory overflow.

**Default Batch Size:** 20 results  
**Configurable:** Via `batch_size` parameter

### Requirement 3: Non-Streaming Option
The API **SHALL** support `?stream=false` for single JSON response (Standard 014).

### Requirement 4: Result Accumulation
The API **SHALL** track total results across all batches.

**Final Metadata:**
```json
{
  "type": "metadata",
  "strategy": "split_merge",
  "totalResults": 45,  // Actual count from all batches
  "query": "android build",
  "durationMs": 15234
}
```

---

## Examples

### Streaming Search (Default)
```bash
curl -X POST http://localhost:3161/v1/memory/search \
  -H "Authorization: Bearer secret" \
  -d '{"query": "android build", "batch_size": 20}'
```

**Response Stream:**
```
data: {"type":"metadata","strategy":"split_merge","totalResults":0,"query":"android build"}

data: {"type":"batch","batchNumber":1,"results":[{"uuid":"...","content":"..."}]}

data: {"type":"metadata","strategy":"split_merge","totalResults":45,"query":"android build","durationMs":15234}
```

### Non-Streaming Search
```bash
curl -X POST "http://localhost:3161/v1/memory/search?stream=false" \
  -H "Authorization: Bearer secret" \
  -d '{"query": "android build"}'
```

**Response:**
```json
{
  "metadata": {"totalResults": 45, "durationMs": 15234},
  "results": [...]
}
```

---

## Implementation

- **File:** `engine/src/routes/v1/search.ts`
- **Streaming:** Lines 107-160
- **Result Accumulation:** Lines 125-130, 145-150
- **Non-streaming:** Lines 21-23, 47-105

---

## Compliance

- [x] SSE streaming implemented
- [x] Batch processing with configurable size
- [x] Result accumulation across batches
- [x] Non-streaming mode support
- [x] Debug mode support

---

## History

- **v4.5.4** (2025-11-15): Initial release as Standard 136
- **v4.8.2** (2026-03-21): Renumbered as Standard 018
- **Implementation:** Part of P0 fixes

---

## References

- [FRICTIONLESS_SPEC.md §4.3](../FRICTIONLESS_SPEC.md#43-non-streaming-mode)
- [API.md](docs/api-reference/API.md)
- Standard 014: Search Content Return
