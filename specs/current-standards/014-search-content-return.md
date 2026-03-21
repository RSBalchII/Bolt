# Standard 014: Search Content Return

**Effective:** 2026-03-21  
**Status:** Active  
**Supersedes:** None (New standard from P0 fixes)

---

## Purpose

Ensure search API returns actual content in results, not just metadata.

---

## Specification

### Requirement 1: Content Inclusion
The search API (`POST /v1/memory/search`) **SHALL** return actual atom/molecule content in results by default.

**Response Format:**
```json
{
  "metadata": {
    "totalResults": 12,
    "durationMs": 150,
    "strategy": "split_merge"
  },
  "results": [
    {
      "uuid": "mol_abc123",
      "content": "The actual text content...",
      "source": "qwen-session-uuid",
      "timestamp": "2026-03-21T15:54:07Z",
      "score": 0.94,
      "tags": ["android", "build"]
    }
  ]
}
```

### Requirement 2: Non-Streaming Mode
The API **SHALL** support `?stream=false` query parameter for single JSON response.

**Default:** Streaming mode (SSE)  
**Non-streaming:** `?stream=false` returns complete JSON object

### Requirement 3: Debug Mode
The API **SHALL** support `?debug=true` for diagnostic information.

**Debug Response Includes:**
- Query tags extracted
- Buckets searched
- Strategy used
- FTS match count
- Graph match count

---

## Examples

### Standard Search (Streaming)
```bash
curl -X POST http://localhost:3161/v1/memory/search \
  -H "Authorization: Bearer secret" \
  -d '{"query": "android build"}'
```

### Non-Streaming Search
```bash
curl -X POST "http://localhost:3161/v1/memory/search?stream=false" \
  -H "Authorization: Bearer secret" \
  -d '{"query": "android build"}'
```

### Debug Search
```bash
curl -X POST "http://localhost:3161/v1/memory/search?stream=false&debug=true" \
  -H "Authorization: Bearer secret" \
  -d '{"query": "android build"}'
```

---

## Compliance

- [x] Engine implementation: `engine/src/routes/v1/search.ts`
- [x] Non-streaming mode: Lines 21-23, 47-105
- [x] Debug mode: Lines 87-96
- [x] Content inclusion: All result objects include `content` field

---

## History

- **v4.8.2** (2026-03-21): Initial release as Standard 014
- **Implementation:** P0 Critical Fix #2

---

## References

- [FRICTIONLESS_SPEC.md §4](../FRICTIONLESS_SPEC.md#4-search-that-returns-content--debuggability)
- [RECURSIVE_SEARCH_FALLBACKS.md](../RECURSIVE_SEARCH_FALLBACKS.md)
- [API.md](docs/api-reference/API.md)
