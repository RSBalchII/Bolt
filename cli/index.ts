#!/usr/bin/env node
/**
 * Anchor CLI - Command-line interface for Bolt Memory
 *
 * Commands:
 * - anchor status: System status and health
 * - anchor search <query>: Search memory
 * - anchor watch add <path>: Add watched path
 * - anchor watch list: List watched paths
 * - anchor config: Show current configuration
 * - anchor agents discover: Discover agent chat directories
 * - anchor ingest status: Check ingestion progress
 */

import { Command } from 'commander';
import { callAPI, formatNumber, loadConfig, updateSettings } from './api-client.js';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get CLI directory
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const program = new Command();

program
  .name('anchor')
  .description('Bolt Memory CLI')
  .version('4.9.0');

// Load settings for commands that need them
let settings: any = {
  server: { port: 3161, api_key: '' },
  watcher: { extra_paths: [] }
};

try {
  const settingsPath = join(projectRoot, 'user_settings.json');
  if (existsSync(settingsPath)) {
    settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
  }
} catch (error: any) {
  // Silently use defaults
}

// ──────────────────────────────────────────────────────────────────────────────
// STATUS COMMAND
// ──────────────────────────────────────────────────────────────────────────────
program
  .command('status')
  .description('Show system status and health')
  .action(async () => {
    try {
      console.log('⚓ Bolt Memory Status');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // Health check
      const health = await callAPI('/health');
      console.log(`Status: ✅ ${health.status || 'healthy'}`);

      // Database stats
      const stats = await callAPI('/v1/stats');
      console.log(`Database: ${formatNumber(stats.atoms || 0)} atoms, ${formatNumber(stats.sources || 0)} sources, ${formatNumber(stats.tags || 0)} tags`);

      // Watchdog status
      const watchdog = await callAPI('/v1/watchdog/status');
      if (watchdog.isRunning) {
        console.log(`Watchdog: ✅ Active (${watchdog.watchedPaths?.length || 0} paths)`);
        watchdog.watchedPaths?.forEach((path: string) => {
          console.log(`   • ${path}`);
        });
      } else {
        console.log('Watchdog: ❌ Inactive');
      }

      // MCP status
      console.log('MCP Server: ✅ Running (stdio)');

      // Uptime (if available)
      if (health.timestamp) {
        const uptime = Date.now() - new Date(health.timestamp).getTime();
        const minutes = Math.floor(uptime / 60000);
        if (minutes > 0) {
          console.log(`Uptime: ${minutes}m`);
        }
      }

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      console.error('\nIs the engine running? Try: anchor-engine start');
      process.exit(1);
    }
  });

// ──────────────────────────────────────────────────────────────────────────────
// SEARCH COMMAND
// ──────────────────────────────────────────────────────────────────────────────
program
  .command('search <query>')
  .description('Search memory')
  .option('--debug', 'Show debug information')
  .option('--max-results <number>', 'Maximum results', '20')
  .option('--strategy <strategy>', 'Search strategy', 'standard')
  .action(async (query, options) => {
    try {
      const startTime = Date.now();

      const results = await callAPI('/v1/memory/search?stream=false', 'POST', {
        query,
        max_results: parseInt(options.maxResults),
        strategy: options.strategy,
      });

      const duration = Date.now() - startTime;
      const metadata = results.metadata || results;

      console.log(`📊 Found ${metadata.totalResults || 0} results (${duration}ms)`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      if (!results.results || results.results.length === 0) {
        console.log('No results found.');
        return;
      }

      results.results.forEach((result: any, index: number) => {
        console.log(`\n[${index + 1}] Score: ${result.score?.toFixed(2) || 'N/A'} | ${result.source || 'unknown'}`);
        
        // Show content (truncate if too long)
        const content = result.content || result.text || '';
        const truncated = content.length > 300 ? content.substring(0, 300) + '...' : content;
        console.log(`    "${truncated.replace(/\n/g, ' ')}"`);

        // Show metadata
        if (result.tags && result.tags.length > 0) {
          console.log(`    Tags: ${result.tags.join(', ')}`);
        }
        if (result.timestamp) {
          console.log(`    Date: ${new Date(result.timestamp).toLocaleDateString()}`);
        }
      });

      // Debug info
      if (options.debug && results.debug) {
        console.log('\n🔍 Debug Info:');
        console.log(`   Query tags: ${results.debug.queryTags?.join(', ') || 'none'}`);
        console.log(`   Strategy: ${results.debug.strategy || 'standard'}`);
        console.log(`   Buckets: ${results.debug.bucketsSearched?.join(', ') || 'all'}`);
      }

      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (error: any) {
      console.error('❌ Search error:', error.message);
      process.exit(1);
    }
  });

// ──────────────────────────────────────────────────────────────────────────────
// WATCH COMMAND
// ──────────────────────────────────────────────────────────────────────────────
program
  .command('watch')
  .description('Manage watched paths');

program
  .command('watch add <path>')
  .description('Add a path to watch')
  .action(async (path) => {
    try {
      const settingsPath = join(projectRoot, 'user_settings.json');
      
      if (!existsSync(settingsPath)) {
        console.error('❌ user_settings.json not found');
        process.exit(1);
      }

      // Read current settings
      const currentSettings = JSON.parse(readFileSync(settingsPath, 'utf8'));
      
      // Add to settings
      if (!currentSettings.watcher.extra_paths.includes(path)) {
        currentSettings.watcher.extra_paths.push(path);
        
        // Write back to settings file
        writeFileSync(settingsPath, JSON.stringify(currentSettings, null, 2) + '\n');
        console.log(`✅ Added to watcher: ${path}`);
      } else {
        console.log(`ℹ️  Path already watched: ${path}`);
      }

      // Restart watchdog
      try {
        await callAPI('/v1/watchdog/start', 'POST');
        console.log('✅ Watchdog restarted');
      } catch (error: any) {
        console.log('⚠️  Watchdog restart failed - may need manual restart');
      }
    } catch (error: any) {
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
      
      if (watchdog.watchedPaths && watchdog.watchedPaths.length > 0) {
        watchdog.watchedPaths.forEach((path: string, index: number) => {
          console.log(`${index + 1}. ${path}`);
        });
      } else {
        console.log('No paths currently watched.');
      }

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`\nConfigured in settings: ${settings.watcher.extra_paths.length} path(s)`);
      settings.watcher.extra_paths.forEach((path: string) => {
        console.log(`   • ${path}`);
      });
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

// ──────────────────────────────────────────────────────────────────────────────
// CONFIG COMMAND
// ──────────────────────────────────────────────────────────────────────────────
program
  .command('config')
  .description('Show current configuration')
  .action(() => {
    console.log('⚙️  Configuration (user_settings.json)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Server Port: ${settings.server.port}`);
    console.log(`API Key: ${settings.server.api_key ? 'set (' + settings.server.api_key.substring(0, 8) + '...)' : 'not set'}`);
    console.log(`Watched Paths: ${settings.watcher.extra_paths.length}`);
    settings.watcher.extra_paths.forEach((path: string) => {
      console.log(`   • ${path}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });

// ──────────────────────────────────────────────────────────────────────────────
// AGENTS COMMAND
// ──────────────────────────────────────────────────────────────────────────────
program
  .command('agents')
  .description('Manage agent integrations');

program
  .command('agents discover')
  .description('Discover agent chat directories')
  .action(async () => {
    const os = await import('os');
    const { join } = await import('path');
    const { readdir, stat } = await import('fs/promises');

    console.log('🔍 Discovering agent chat directories...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const homeDir = os.homedir();
    const discoveries = [
      {
        id: 'qwen',
        name: 'Qwen Code',
        paths: [
          join(homeDir, '.qwen', 'projects', '-data-data-com-termux-files-home', 'chats'),
          join(homeDir, '.qwen', 'projects', 'chats'),
        ]
      },
      {
        id: 'claude',
        name: 'Claude Desktop',
        paths: [
          join(homeDir, '.config', 'Claude', 'chats'), // Linux
          join(homeDir, 'Library', 'Application Support', 'Claude', 'chats'), // macOS
        ]
      },
      {
        id: 'cursor',
        name: 'Cursor',
        paths: [
          join(homeDir, '.cursor', 'chats'),
        ]
      },
      {
        id: 'continue',
        name: 'Continue.dev',
        paths: [
          join(homeDir, '.continue', 'dev_data'),
        ]
      }
    ];

    for (const agent of discoveries) {
      for (const path of agent.paths) {
        try {
          const stats = await stat(path);
          if (stats.isDirectory()) {
            const files = await readdir(path);
            const jsonlFiles = files.filter(f => f.endsWith('.jsonl')).length;
            
            const alreadyWatched = settings.watcher.extra_paths.some(p => p.includes(agent.id) || p.includes(path));
            
            console.log(`\n✅ Found: ${agent.name}`);
            console.log(`   Path: ${path}`);
            console.log(`   Sessions: ${jsonlFiles} .jsonl files`);
            console.log(`   Watched: ${alreadyWatched ? '✅ Yes' : '❌ No'}`);
            
            if (!alreadyWatched) {
              console.log(`   → Add with: anchor agents add ${agent.id}`);
            }
            break; // Found one path for this agent
          }
        } catch (error: any) {
          // Path doesn't exist, try next
        }
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });

program
  .command('agents add <agent>')
  .description('Add an agent\'s chat directory')
  .action(async (agentId) => {
    const os = await import('os');
    const { join } = await import('path');
    const { stat } = await import('fs/promises');
    const { writeFileSync } = await import('fs');

    const homeDir = os.homedir();
    const agentPaths: any = {
      qwen: join(homeDir, '.qwen', 'projects', '-data-data-com-termux-files-home', 'chats'),
      claude: join(homeDir, '.config', 'Claude', 'chats'),
      cursor: join(homeDir, '.cursor', 'chats'),
      continue: join(homeDir, '.continue', 'dev_data'),
    };

    const path = agentPaths[agentId.toLowerCase()];
    if (!path) {
      console.error(`❌ Unknown agent: ${agentId}`);
      console.error('Available agents: qwen, claude, cursor, continue');
      process.exit(1);
    }

    try {
      await stat(path);
      
      const settingsPath = join(projectRoot, 'user_settings.json');
      const currentSettings = JSON.parse(readFileSync(settingsPath, 'utf8'));
      
      if (!currentSettings.watcher.extra_paths.includes(path)) {
        currentSettings.watcher.extra_paths.push(path);
        writeFileSync(settingsPath, JSON.stringify(currentSettings, null, 2) + '\n');
        console.log(`✅ Added ${agentId} chat directory: ${path}`);
        console.log('ℹ️  Restart engine to apply changes: anchor-engine restart');
      } else {
        console.log(`ℹ️  Path already watched: ${path}`);
      }
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.error(`❌ Path not found: ${path}`);
        console.error('Make sure the agent is installed first.');
      } else {
        console.error('❌ Error:', error.message);
      }
      process.exit(1);
    }
  });

// ──────────────────────────────────────────────────────────────────────────────
// INGEST COMMAND
// ──────────────────────────────────────────────────────────────────────────────
program
  .command('ingest')
  .description('Manage ingestion');

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
        console.log(`Current File: ${status.currentFile || 'processing...'}`);
        console.log(`Processed: ${status.processed || 0} / ${status.total || '?'} files`);
        console.log(`Atoms Created: ${formatNumber(status.atomsCreated || 0)}`);
        
        if (status.errors && status.errors.length > 0) {
          console.log(`Errors: ${status.errors.length}`);
          status.errors.forEach((err: string, i: number) => {
            console.log(`   ${i + 1}. ${err}`);
          });
        }
      } else {
        console.log('Status: ⏸️  Inactive (no active ingestion)');
      }

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

// Parse and run
program.parse();
