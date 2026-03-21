#!/usr/bin/env node
/**
 * Anchor CLI - JavaScript version (no compilation needed)
 *
 * Run directly with: node cli/index.js
 */

import { Command } from 'commander';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Load settings
function loadSettings() {
  try {
    const settingsPath = join(projectRoot, 'user_settings.json');
    if (existsSync(settingsPath)) {
      return JSON.parse(readFileSync(settingsPath, 'utf8'));
    }
  } catch (error) {
    // Use defaults
  }
  return {
    server: { port: 3161, api_key: '' },
    watcher: { extra_paths: [] }
  };
}

let settings = loadSettings();

const API_URL = `http://localhost:${settings.server.port || 3161}`;
const API_KEY = settings.server.api_key || '';

// API client
async function callAPI(endpoint, method = 'GET', body) {
  const url = `${API_URL}${endpoint}`;
  const headers = { 'Content-Type': 'application/json' };

  if (API_KEY) {
    headers['Authorization'] = `Bearer ${API_KEY}`;
  }

  try {
    const response = await axios({ url, method, headers, data: body });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error(`Cannot connect to Anchor Engine at ${API_URL}\nIs the engine running? Try: anchor-engine start`);
    }
    throw error;
  }
}

function formatNumber(num) {
  return num.toLocaleString();
}

const program = new Command();

program
  .name('anchor')
  .description('Anchor Engine CLI - Persistent memory for AI agents')
  .version('4.9.0');

// STATUS command
program
  .command('status')
  .description('Show system status')
  .action(async () => {
    try {
      console.log('⚓ Anchor Engine Status');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      const health = await callAPI('/health');
      console.log(`Status: ✅ ${health.status || 'healthy'}`);

      const stats = await callAPI('/v1/stats');
      console.log(`Database: ${formatNumber(stats.atoms || 0)} atoms, ${formatNumber(stats.sources || 0)} sources`);

      try {
        const watchdog = await callAPI('/v1/watchdog/status');
        if (watchdog.isRunning) {
          console.log(`Watchdog: ✅ Active (${watchdog.watchedPaths?.length || 0} paths)`);
        } else {
          console.log('Watchdog: ❌ Inactive');
        }
      } catch {
        console.log('Watchdog: ❌ Inactive');
      }

      console.log('MCP Server: ✅ Running (stdio)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

// SEARCH command
program
  .command('search <query>')
  .description('Search memory')
  .option('--debug', 'Show debug info')
  .option('--max-results <number>', 'Max results', '20')
  .action(async (query, options) => {
    try {
      const results = await callAPI('/v1/memory/search?stream=false', 'POST', {
        query,
        max_results: parseInt(options.maxResults),
      });

      console.log(`📊 Found ${results.metadata?.totalResults || 0} results`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      if (!results.results || results.results.length === 0) {
        console.log('No results found.');
        return;
      }

      results.results.forEach((r, i) => {
        console.log(`\n[${i + 1}] Score: ${r.score?.toFixed(2) || 'N/A'}`);
        const content = r.content || r.lineContent || '';
        console.log(`    "${content.substring(0, 200)}${content.length > 200 ? '...' : ''}"`);
        if (r.source) {
          console.log(`    Source: ${r.source}`);
        }
      });

      if (options.debug && results.debug) {
        console.log('\n🔍 Debug:', JSON.stringify(results.debug, null, 2));
      }
    } catch (error) {
      console.error('❌ Search error:', error.message);
      process.exit(1);
    }
  });

// WATCH command (parent)
const watchCmd = program
  .command('watch')
  .description('Manage watched paths');

watchCmd
  .command('add <path>')
  .description('Add a path to watch')
  .action(async (path) => {
    try {
      const settingsPath = join(projectRoot, 'user_settings.json');
      const current = JSON.parse(readFileSync(settingsPath, 'utf8'));

      if (!current.watcher) current.watcher = { extra_paths: [] };
      if (!current.watcher.extra_paths) current.watcher.extra_paths = [];

      if (!current.watcher.extra_paths.includes(path)) {
        current.watcher.extra_paths.push(path);
        writeFileSync(settingsPath, JSON.stringify(current, null, 2) + '\n');
        console.log(`✅ Added: ${path}`);

        try {
          await callAPI('/v1/watchdog/start', 'POST');
          console.log('✅ Watchdog restarted');
        } catch {
          console.log('ℹ️  Restart engine to apply changes');
        }
      } else {
        console.log(`ℹ️  Already watched: ${path}`);
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

watchCmd
  .command('list')
  .description('List watched paths')
  .action(async () => {
    try {
      const watchdog = await callAPI('/v1/watchdog/status');
      console.log('📁 Watched Paths:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      if (watchdog.watchedPaths && watchdog.watchedPaths.length > 0) {
        watchdog.watchedPaths.forEach((p, i) => console.log(`${i + 1}. ${p}`));
      } else {
        console.log('No paths configured.');
        console.log('\nAdd a path: anchor watch add /path/to/chats');
      }

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (error) {
      // Fallback to settings file
      console.log('📁 Watched Paths (from settings):');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      if (settings.watcher?.extra_paths?.length > 0) {
        settings.watcher.extra_paths.forEach((p, i) => console.log(`${i + 1}. ${p}`));
      } else {
        console.log('No paths configured.');
      }
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
  });

// CONFIG command
program
  .command('config')
  .description('Show configuration')
  .action(() => {
    console.log('⚙️  Configuration');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Port: ${settings.server?.port || 3161}`);
    console.log(`API Key: ${settings.server?.api_key ? 'set' : 'not set'}`);
    console.log(`Watched Paths: ${settings.watcher?.extra_paths?.length || 0}`);
    if (settings.watcher?.extra_paths?.length > 0) {
      settings.watcher.extra_paths.forEach(p => console.log(`   • ${p}`));
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });

// AGENTS command (parent)
const agentsCmd = program
  .command('agents')
  .description('Discover and manage AI agent integrations');

agentsCmd
  .command('discover')
  .description('Discover agent chat directories')
  .action(async () => {
    console.log('🔍 Discovering agents...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
      // Try API endpoint first
      const result = await callAPI('/v1/agent/discover');

      if (result.agents && result.agents.length > 0) {
        for (const agent of result.agents) {
          console.log(`\n✅ ${agent.name}`);
          console.log(`   Path: ${agent.path}`);
          console.log(`   Sessions: ${agent.sessionCount} files`);
          console.log(`   Watched: ${agent.isWatched ? '✅' : '❌'}`);
          if (!agent.isWatched) {
            console.log(`   → Add: anchor agents add ${agent.id}`);
          }
        }
      } else {
        console.log('\n❌ No agent chat directories found.');
        console.log('\nSupported agents:');
        console.log('   • Qwen Code (~/.qwen/projects/*/chats)');
        console.log('   • Claude Desktop (~/.config/Claude/chats)');
        console.log('   • Cursor (~/.cursor/chats)');
        console.log('   • Continue.dev (~/.continue/chats)');
      }
    } catch (error) {
      // Fallback to local discovery if API not available
      console.log('\n⚠️  Engine not available, using local discovery...\n');

      const os = await import('os');
      const { join } = await import('path');
      const { stat, readdir } = await import('fs/promises');

      const homeDir = os.homedir();
      const agents = [
        {
          id: 'qwen',
          name: 'Qwen Code',
          paths: [
            join(homeDir, '.qwen', 'projects', '-data-data-com-termux-files-home', 'chats'),
            join(homeDir, '.qwen', 'projects', '-', 'chats'),
          ]
        },
        {
          id: 'claude',
          name: 'Claude Desktop',
          paths: [
            join(homeDir, '.config', 'Claude', 'chats'),
            join(homeDir, 'Library', 'Application Support', 'Claude', 'chats'),
          ]
        },
        {
          id: 'cursor',
          name: 'Cursor',
          paths: [join(homeDir, '.cursor', 'chats')]
        },
        {
          id: 'continue',
          name: 'Continue.dev',
          paths: [join(homeDir, '.continue', 'chats')]
        }
      ];

      let foundAny = false;
      for (const agent of agents) {
        for (const agentPath of agent.paths) {
          try {
            const s = await stat(agentPath);
            if (s.isDirectory()) {
              const files = await readdir(agentPath);
              const count = files.filter(f => f.endsWith('.jsonl')).length;
              const watched = settings.watcher?.extra_paths?.some(p => p.includes(agentPath)) || false;

              console.log(`\n✅ ${agent.name}`);
              console.log(`   Path: ${agentPath}`);
              console.log(`   Sessions: ${count} files`);
              console.log(`   Watched: ${watched ? '✅' : '❌'}`);
              if (!watched) {
                console.log(`   → Add: anchor agents add ${agent.id}`);
              }
              foundAny = true;
              break;
            }
          } catch (e) { /* not found */ }
        }
      }

      if (!foundAny) {
        console.log('\n❌ No agent chat directories found.');
      }
    }
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });

agentsCmd
  .command('add <agent>')
  .description('Add an agent\'s chat directory to watched paths')
  .action(async (agentId) => {
    try {
      // Try API endpoint first
      const result = await callAPI('/v1/agent/add', 'POST', { agent_id: agentId });

      if (result.status === 'success') {
        console.log(`✅ ${result.message}`);
        console.log(`   Path: ${result.path}`);
      } else {
        console.error(`❌ ${result.error}`);
      }
    } catch (error) {
      // Fallback to local add if API not available
      console.log('⚠️  Engine not available, adding to settings file directly...\n');

      const os = await import('os');
      const { join } = await import('path');
      const { stat } = await import('fs/promises');

      const homeDir = os.homedir();
      const agentPaths = {
        qwen: [
          join(homeDir, '.qwen', 'projects', '-data-data-com-termux-files-home', 'chats'),
          join(homeDir, '.qwen', 'projects', '-', 'chats'),
        ],
        claude: [
          join(homeDir, '.config', 'Claude', 'chats'),
          join(homeDir, 'Library', 'Application Support', 'Claude', 'chats'),
        ],
        cursor: [join(homeDir, '.cursor', 'chats')],
        continue: [join(homeDir, '.continue', 'chats')],
      };

      const paths = agentPaths[agentId.toLowerCase()];
      if (!paths) {
        console.error('❌ Unknown agent. Available: qwen, claude, cursor, continue');
        process.exit(1);
      }

      // Find first existing path
      let foundPath = null;
      for (const p of paths) {
        try {
          await stat(p);
          foundPath = p;
          break;
        } catch {
          // Try next
        }
      }

      if (!foundPath) {
        console.error(`❌ Agent directory not found for: ${agentId}`);
        console.log(`   Expected locations:`);
        paths.forEach(p => console.log(`   • ${p}`));
        process.exit(1);
      }

      const settingsPath = join(projectRoot, 'user_settings.json');
      const current = JSON.parse(readFileSync(settingsPath, 'utf8'));

      if (!current.watcher) current.watcher = { extra_paths: [] };
      if (!current.watcher.extra_paths) current.watcher.extra_paths = [];

      if (!current.watcher.extra_paths.includes(foundPath)) {
        current.watcher.extra_paths.push(foundPath);
        writeFileSync(settingsPath, JSON.stringify(current, null, 2) + '\n');
        console.log(`✅ Added ${agentId}: ${foundPath}`);
        console.log('ℹ️  Restart engine to apply changes');
      } else {
        console.log(`ℹ️  Already added: ${foundPath}`);
      }
    }
  });

// INGEST command (parent)
const ingestCmd = program
  .command('ingest')
  .description('Manage ingestion');

ingestCmd
  .command('status')
  .description('Check ingestion progress')
  .action(async () => {
    try {
      const status = await callAPI('/v1/ingest/status');
      console.log('📁 Ingestion Status');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      if (status.active) {
        console.log(`Status: ✅ Active`);
        console.log(`Current File: ${status.currentFile || 'N/A'}`);
        console.log(`Progress: ${status.processed || 0}/${status.total || '?'} files`);
        console.log(`Atoms Created: ${formatNumber(status.atomsCreated || 0)}`);
        if (status.errors && status.errors.length > 0) {
          console.log(`Errors: ${status.errors.length}`);
        }
      } else {
        console.log('Status: ⏸️  Inactive');
        console.log('\nStart ingestion: anchor ingest start');
      }
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (error) {
      console.log('📁 Ingestion Status');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Status: ⏸️  Inactive (no active ingestion)');
      console.log('\nStart ingestion: anchor ingest start');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
  });

ingestCmd
  .command('start')
  .description('Start ingestion of watched paths')
  .action(async () => {
    try {
      const result = await callAPI('/v1/watchdog/ingest', 'POST');
      console.log('✅ Ingestion started');
      console.log(`   Files: ${result.filesProcessed || 0} processed`);
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

// GRAPH command (parent)
const graphCmd = program
  .command('graph')
  .description('Graph operations');

graphCmd
  .command('export')
  .description('Export knowledge graph as markdown')
  .option('-o, --output <file>', 'Output file', 'KNOWLEDGE.md')
  .option('--max-nodes <number>', 'Maximum nodes to include', '100')
  .option('--no-content', 'Exclude content snippets')
  .action(async (options) => {
    try {
      const params = new URLSearchParams({
        maxNodes: options.maxNodes,
        includeContent: options.content ? 'true' : 'false'
      });

      if (options.output) {
        params.set('output', options.output);
      }

      const result = await callAPI(`/v1/graph/export?${params}`);

      if (result.status === 'success') {
        if (result.outputPath) {
          console.log(`✅ Exported ${result.nodeCount} nodes to: ${result.outputPath}`);
        } else {
          // Write content to file
          const outputPath = options.output || 'KNOWLEDGE.md';
          writeFileSync(outputPath, result.content);
          console.log(`✅ Exported ${result.nodeCount} nodes to: ${outputPath}`);
        }
      } else {
        console.error('❌ Export failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program.parse();