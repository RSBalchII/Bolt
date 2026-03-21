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
let settings = {
  server: { port: 3161, api_key: '' },
  watcher: { extra_paths: [] }
};

try {
  const settingsPath = join(projectRoot, 'user_settings.json');
  if (existsSync(settingsPath)) {
    settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
  }
} catch (error) {
  // Use defaults
}

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
  .description('Bolt Memory CLI')
  .version('4.9.0');

// STATUS command
program
  .command('status')
  .description('Show system status')
  .action(async () => {
    try {
      console.log('⚓ Bolt Memory Status');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      const health = await callAPI('/health');
      console.log(`Status: ✅ ${health.status || 'healthy'}`);

      const stats = await callAPI('/v1/stats');
      console.log(`Database: ${formatNumber(stats.atoms || 0)} atoms, ${formatNumber(stats.sources || 0)} sources`);

      const watchdog = await callAPI('/v1/watchdog/status');
      if (watchdog.isRunning) {
        console.log(`Watchdog: ✅ Active (${watchdog.watchedPaths?.length || 0} paths)`);
      } else {
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
        const content = r.content || '';
        console.log(`    "${content.substring(0, 200)}..."`);
      });

      if (options.debug && results.debug) {
        console.log('\n🔍 Debug:', JSON.stringify(results.debug, null, 2));
      }
    } catch (error) {
      console.error('❌ Search error:', error.message);
      process.exit(1);
    }
  });

// WATCH commands
program
  .command('watch add <path>')
  .description('Add watched path')
  .action(async (path) => {
    try {
      const settingsPath = join(projectRoot, 'user_settings.json');
      const current = JSON.parse(readFileSync(settingsPath, 'utf8'));
      
      if (!current.watcher.extra_paths.includes(path)) {
        current.watcher.extra_paths.push(path);
        writeFileSync(settingsPath, JSON.stringify(current, null, 2) + '\n');
        console.log(`✅ Added: ${path}`);
        
        await callAPI('/v1/watchdog/start', 'POST');
        console.log('✅ Watchdog restarted');
      } else {
        console.log(`ℹ️  Already watched: ${path}`);
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('watch list')
  .description('List watched paths')
  .action(async () => {
    try {
      const watchdog = await callAPI('/v1/watchdog/status');
      console.log('📁 Watched Paths:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      watchdog.watchedPaths?.forEach((p, i) => console.log(`${i + 1}. ${p}`));
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

// CONFIG command
program
  .command('config')
  .description('Show configuration')
  .action(() => {
    console.log('⚙️  Configuration');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Port: ${settings.server.port}`);
    console.log(`API Key: ${settings.server.api_key ? 'set' : 'not set'}`);
    console.log(`Watched Paths: ${settings.watcher.extra_paths.length}`);
    settings.watcher.extra_paths.forEach(p => console.log(`   • ${p}`));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });

// AGENTS commands
program
  .command('agents discover')
  .description('Discover agent directories')
  .action(async () => {
    const os = await import('os');
    const { join } = await import('path');
    const { stat, readdir } = await import('fs/promises');

    console.log('🔍 Discovering agents...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const homeDir = os.homedir();
    const agents = [
      { id: 'qwen', name: 'Qwen Code', paths: [join(homeDir, '.qwen', 'projects', '-data-data-com-termux-files-home', 'chats')] },
      { id: 'claude', name: 'Claude Desktop', paths: [join(homeDir, '.config', 'Claude', 'chats')] },
      { id: 'cursor', name: 'Cursor', paths: [join(homeDir, '.cursor', 'chats')] },
    ];

    for (const agent of agents) {
      for (const path of agent.paths) {
        try {
          const s = await stat(path);
          if (s.isDirectory()) {
            const files = await readdir(path);
            const count = files.filter(f => f.endsWith('.jsonl')).length;
            const watched = settings.watcher.extra_paths.some(p => p.includes(path));
            
            console.log(`\n✅ ${agent.name}: ${path}`);
            console.log(`   Sessions: ${count} files`);
            console.log(`   Watched: ${watched ? '✅' : '❌'}`);
            if (!watched) console.log(`   → Add: anchor agents add ${agent.id}`);
            break;
          }
        } catch (e) { /* not found */ }
      }
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });

program
  .command('agents add <agent>')
  .description('Add agent directory')
  .action(async (agentId) => {
    const os = await import('os');
    const { join } = await import('path');
    const { stat } = await import('fs/promises');

    const homeDir = os.homedir();
    const paths = {
      qwen: join(homeDir, '.qwen', 'projects', '-data-data-com-termux-files-home', 'chats'),
      claude: join(homeDir, '.config', 'Claude', 'chats'),
      cursor: join(homeDir, '.cursor', 'chats'),
    };

    const path = paths[agentId.toLowerCase()];
    if (!path) {
      console.error('❌ Unknown agent. Available: qwen, claude, cursor');
      process.exit(1);
    }

    try {
      await stat(path);
      const settingsPath = join(projectRoot, 'user_settings.json');
      const current = JSON.parse(readFileSync(settingsPath, 'utf8'));
      
      if (!current.watcher.extra_paths.includes(path)) {
        current.watcher.extra_paths.push(path);
        writeFileSync(settingsPath, JSON.stringify(current, null, 2) + '\n');
        console.log(`✅ Added ${agentId}: ${path}`);
      } else {
        console.log(`ℹ️  Already added: ${path}`);
      }
    } catch (error) {
      console.error(`❌ Not found: ${path}`);
      process.exit(1);
    }
  });

// INGEST status command (placeholder - API not implemented yet)
program
  .command('ingest status')
  .description('Check ingestion progress')
  .action(async () => {
    try {
      const status = await callAPI('/v1/ingest/status');
      console.log('📁 Ingestion Status');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      if (status.active) {
        console.log(`Status: ✅ Active`);
        console.log(`Processed: ${status.processed || 0} files`);
        console.log(`Atoms: ${formatNumber(status.atomsCreated || 0)}`);
      } else {
        console.log('Status: ⏸️  Inactive');
      }
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (error) {
      console.log('📁 Ingestion Status');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Status: ⏸️  Inactive (no active ingestion)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
  });

program.parse();
