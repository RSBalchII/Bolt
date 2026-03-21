/**
 * Graph Export Service
 *
 * Exports the knowledge graph as markdown with wiki-links.
 * Creates a KNOWLEDGE.md file that represents the corpus structure.
 */

import { db } from '../core/db.js';
import { PATHS } from '../config/paths.js';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, basename } from 'path';

export interface GraphExportOptions {
  /** Maximum number of nodes to include */
  maxNodes?: number;
  /** Minimum edge weight to include */
  minWeight?: number;
  /** Include atom content snippets */
  includeContent?: boolean;
  /** Maximum content snippet length */
  maxContentLength?: number;
  /** Filter by bucket */
  bucket?: string;
  /** Filter by tag */
  tag?: string;
}

export interface GraphExportResult {
  /** Generated markdown content */
  content: string;
  /** Number of nodes included */
  nodeCount: number;
  /** Number of edges included */
  edgeCount: number;
  /** Output file path */
  outputPath?: string;
}

/**
 * Get top hub atoms (most connected nodes)
 */
async function getHubAtoms(limit: number = 50): Promise<any[]> {
  const result = await db.run(`
    SELECT
      a.uuid,
      a.content,
      a.source_id,
      COUNT(e.target_uuid) as connection_count
    FROM atoms a
    LEFT JOIN edges e ON a.uuid = e.source_uuid
    GROUP BY a.uuid
    ORDER BY connection_count DESC
    LIMIT ?
  `, [limit]);

  return result.rows || [];
}

/**
 * Get top tags with their atom counts
 */
async function getTopTags(limit: number = 100): Promise<any[]> {
  const result = await db.run(`
    SELECT
      tag,
      COUNT(DISTINCT atom_uuid) as atom_count
    FROM tags
    WHERE tag IS NOT NULL
    GROUP BY tag
    ORDER BY atom_count DESC
    LIMIT ?
  `, [limit]);

  return result.rows || [];
}

/**
 * Get sources with their atom counts
 */
async function getSources(): Promise<any[]> {
  const result = await db.run(`
    SELECT
      s.id,
      s.path,
      COUNT(a.uuid) as atom_count
    FROM sources s
    LEFT JOIN atoms a ON s.id = a.source_id
    GROUP BY s.id
    ORDER BY atom_count DESC
  `);

  return result.rows || [];
}

/**
 * Get atoms for a specific tag
 */
async function getAtomsForTag(tag: string, limit: number = 10): Promise<any[]> {
  const result = await db.run(`
    SELECT
      a.uuid,
      a.content,
      a.source_id
    FROM atoms a
    JOIN tags t ON a.uuid = t.atom_uuid
    WHERE t.tag = ?
    LIMIT ?
  `, [tag, limit]);

  return result.rows || [];
}

/**
 * Generate wiki-link for an atom
 */
function generateWikiLink(atom: any): string {
  // Use first 50 chars of content as link text
  const linkText = (atom.content || atom.uuid)
    .substring(0, 50)
    .replace(/[\n\r]/g, ' ')
    .replace(/[\[\]]/g, '');
  return `[[${atom.uuid}|${linkText}...]]`;
}

/**
 * Export knowledge graph as markdown
 */
export async function exportGraph(
  options: GraphExportOptions = {}
): Promise<GraphExportResult> {
  const {
    maxNodes = 100,
    minWeight = 1,
    includeContent = true,
    maxContentLength = 200,
    bucket,
    tag
  } = options;

  let markdown = `# Knowledge Graph Export

> Generated: ${new Date().toISOString()}
> Engine: Anchor Engine v4.9.0

---

## 📊 Statistics

`;

  // Get statistics
  const statsResult = await db.run(`
    SELECT
      (SELECT COUNT(*) FROM atoms) as atoms,
      (SELECT COUNT(*) FROM sources) as sources,
      (SELECT COUNT(DISTINCT tag) FROM tags WHERE tag IS NOT NULL) as tags,
      (SELECT COUNT(*) FROM molecules) as molecules
  `);

  const stats = statsResult.rows?.[0] || { atoms: 0, sources: 0, tags: 0, molecules: 0 };

  markdown += `| Metric | Count |
|--------|-------|
| Atoms | ${stats.atoms?.toLocaleString() || 0} |
| Sources | ${stats.sources?.toLocaleString() || 0} |
| Tags | ${stats.tags?.toLocaleString() || 0} |
| Molecules | ${stats.molecules?.toLocaleString() || 0} |

---

## 🏷️ Top Tags

`;

  // Get top tags
  const tags = await getTopTags(50);
  let edgeCount = 0;

  for (const t of tags) {
    const tagLink = `#${t.tag}`;
    markdown += `- ${tagLink} (${t.atom_count} atoms)\n`;
    edgeCount += t.atom_count;
  }

  markdown += `
---

## 🔗 Hub Atoms (Most Connected)

These atoms have the most connections in the knowledge graph:

`;

  // Get hub atoms
  const hubs = await getHubAtoms(maxNodes);

  for (let i = 0; i < hubs.length; i++) {
    const hub = hubs[i];
    markdown += `### ${i + 1}. ${generateWikiLink(hub)}\n`;
    markdown += `   - Connections: ${hub.connection_count}\n`;

    if (includeContent && hub.content) {
      const content = hub.content.substring(0, maxContentLength);
      markdown += `   - Content: "${content}${hub.content.length > maxContentLength ? '...' : ''}"\n`;
    }
    markdown += '\n';
  }

  markdown += `---

## 📁 Sources

`;

  // Get sources
  const sources = await getSources();

  for (const source of sources) {
    const sourceName = basename(source.path || source.id);
    markdown += `- [[${source.id}|${sourceName}]] (${source.atom_count} atoms)\n`;
  }

  markdown += `
---

## 🧭 Navigation

- Use \`anchor search <query>\` to find specific content
- Use \`anchor graph export\` to regenerate this file
- Use \`anchor agents discover\` to find agent chat directories

---

*This export represents a snapshot of your knowledge graph.*
`;

  return {
    content: markdown,
    nodeCount: hubs.length,
    edgeCount
  };
}

/**
 * Export graph to file
 */
export async function exportGraphToFile(
  outputPath?: string,
  options: GraphExportOptions = {}
): Promise<GraphExportResult> {
  const result = await exportGraph(options);

  // Default output path
  const finalPath = outputPath || join(PATHS.MIRRORED_BRAIN_DIR, 'KNOWLEDGE.md');

  // Ensure directory exists
  const dir = join(finalPath, '..');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  // Write file
  writeFileSync(finalPath, result.content, 'utf-8');
  result.outputPath = finalPath;

  console.log(`[GraphExport] Exported ${result.nodeCount} nodes to ${finalPath}`);

  return result;
}