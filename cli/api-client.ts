/**
 * CLI API Client
 * 
 * Shared API client for CLI commands.
 * Reads configuration from user_settings.json (same as engine).
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { fetch } from 'undici';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

interface CLIConfig {
  apiUrl: string;
  apiKey: string;
}

/**
 * Load configuration from user_settings.json
 */
export function loadConfig(): CLIConfig {
  let settings: any = {
    server: { port: 3161, api_key: '' },
  };

  try {
    const settingsPath = join(projectRoot, 'user_settings.json');
    if (existsSync(settingsPath)) {
      settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
      console.log('✅ CLI: Loaded settings from user_settings.json');
    }
  } catch (error: any) {
    console.warn('⚠️  CLI: Could not load user_settings.json, using defaults');
  }

  return {
    apiUrl: `http://localhost:${settings.server.port || 3161}`,
    apiKey: settings.server.api_key || '',
  };
}

/**
 * Make API call to Anchor Engine
 */
export async function callAPI<T>(
  endpoint: string,
  method: string = 'GET',
  body?: any
): Promise<T> {
  const config = loadConfig();
  const url = `${config.apiUrl}${endpoint}`;

  const options: any = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (config.apiKey) {
    options.headers['Authorization'] = `Bearer ${config.apiKey}`;
  }

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    // Handle streaming responses (SSE)
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('text/event-stream')) {
      const text = await response.text();
      // Parse SSE events
      const events = text
        .split('\n\n')
        .filter((e) => e.trim())
        .map((event) => {
          const dataMatch = event.match(/data: (.+)/);
          return dataMatch ? JSON.parse(dataMatch[1]) : null;
        })
        .filter(Boolean);
      return events as T;
    }

    return response.json() as Promise<T>;
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error(
        `Cannot connect to Anchor Engine at ${config.apiUrl}\nIs the engine running? Try: anchor-engine start`
      );
    }
    throw error;
  }
}

/**
 * Format numbers with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Update settings file
 */
export function updateSettings(
  updater: (settings: any) => void
): boolean {
  const settingsPath = join(projectRoot, 'user_settings.json');

  try {
    if (!existsSync(settingsPath)) {
      console.error('❌ user_settings.json not found');
      return false;
    }

    const settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
    updater(settings);

    // Write back with proper formatting
    const content = JSON.stringify(settings, null, 2);
    // In a real implementation, we'd write back to file
    // For now, just log what would be written
    console.log('ℹ️  Settings would be updated (write not implemented yet)');
    return true;
  } catch (error: any) {
    console.error('❌ Failed to update settings:', error.message);
    return false;
  }
}
