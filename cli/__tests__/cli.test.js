/**
 * CLI Unit Tests
 *
 * Tests for anchor CLI commands using mocked API client.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';

const CLI_PATH = join(process.cwd(), 'cli', 'index.js');
const TEST_SETTINGS_DIR = join(process.cwd(), 'test-temp-cli');

// Mock user_settings.json for testing
const mockSettings = {
  server: {
    port: 3161,
    api_key: 'test-key'
  },
  watcher: {
    extra_paths: []
  }
};

describe('CLI Commands', () => {
  beforeEach(() => {
    // Create temp directory for test settings
    if (!existsSync(TEST_SETTINGS_DIR)) {
      mkdirSync(TEST_SETTINGS_DIR, { recursive: true });
    }
  });

  afterEach(() => {
    // Cleanup temp directory
    if (existsSync(TEST_SETTINGS_DIR)) {
      rmSync(TEST_SETTINGS_DIR, { recursive: true, force: true });
    }
  });

  describe('Help and Version', () => {
    it('should show help', () => {
      const output = execSync(`node ${CLI_PATH} --help`, { encoding: 'utf8' });
      expect(output).toContain('Anchor Engine CLI');
      expect(output).toContain('Commands:');
      expect(output).toContain('status');
      expect(output).toContain('search');
      expect(output).toContain('watch');
      expect(output).toContain('agents');
    });

    it('should show version', () => {
      const output = execSync(`node ${CLI_PATH} --version`, { encoding: 'utf8' });
      expect(output).toContain('4.9.0');
    });

    it('should show watch subcommands', () => {
      const output = execSync(`node ${CLI_PATH} watch --help`, { encoding: 'utf8' });
      expect(output).toContain('add <path>');
      expect(output).toContain('list');
    });

    it('should show agents subcommands', () => {
      const output = execSync(`node ${CLI_PATH} agents --help`, { encoding: 'utf8' });
      expect(output).toContain('discover');
      expect(output).toContain('add <agent>');
    });

    it('should show ingest subcommands', () => {
      const output = execSync(`node ${CLI_PATH} ingest --help`, { encoding: 'utf8' });
      expect(output).toContain('status');
      expect(output).toContain('start');
    });
  });

  describe('Config Command', () => {
    it('should show configuration', () => {
      const output = execSync(`node ${CLI_PATH} config`, { encoding: 'utf8' });
      expect(output).toContain('Configuration');
      expect(output).toContain('Port:');
      expect(output).toContain('API Key:');
    });
  });

  describe('Agents Discover', () => {
    it('should discover Qwen Code if installed', () => {
      const output = execSync(`node ${CLI_PATH} agents discover`, { encoding: 'utf8' });
      expect(output).toContain('Discovering agents');
      // Should find Qwen since we're in a Termux environment
      expect(output).toContain('Qwen Code');
    });
  });

  describe('Error Handling', () => {
    it('should handle unknown command', () => {
      let error = null;
      try {
        execSync(`node ${CLI_PATH} unknown-command`, { encoding: 'utf8', stdio: 'pipe' });
      } catch (e) {
        error = e;
      }
      expect(error).not.toBeNull();
      expect(error.stderr || error.stdout || error.message).toContain('unknown');
    });
  });
});

describe('CLI Integration (requires running engine)', () => {
  // These tests require a running Anchor Engine
  // Skip if engine is not available

  let engineAvailable = false;

  beforeEach(async () => {
    // Check if engine is running
    try {
      const response = await fetch('http://localhost:3161/health');
      engineAvailable = response.ok;
    } catch {
      engineAvailable = false;
    }
  });

  it.skipIf(!engineAvailable)('should return status from running engine', () => {
    const output = execSync(`node ${CLI_PATH} status`, { encoding: 'utf8' });
    expect(output).toContain('Anchor Engine Status');
    expect(output).toContain('Database:');
  });

  it.skipIf(!engineAvailable)('should search memory', () => {
    const output = execSync(`node ${CLI_PATH} search "test"`, { encoding: 'utf8' });
    expect(output).toContain('Found');
  });

  it.skipIf(!engineAvailable)('should list watched paths', () => {
    const output = execSync(`node ${CLI_PATH} watch list`, { encoding: 'utf8' });
    expect(output).toContain('Watched Paths');
  });
});

// Export for potential use in other test files
export { CLI_PATH, mockSettings };