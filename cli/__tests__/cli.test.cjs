/**
 * CLI Unit Tests
 *
 * Tests for anchor CLI commands using Jest.
 */

const { execSync } = require('child_process');
const { writeFileSync, mkdirSync, rmSync, existsSync } = require('fs');
const path = require('path');

const CLI_PATH = path.join(__dirname, '..', 'index.js');

describe('CLI Commands', () => {
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
      expect(() => {
        execSync(`node ${CLI_PATH} unknown-command`, { encoding: 'utf8', stdio: 'pipe' });
      }).toThrow();
    });
  });
});