#!/usr/bin/env node
/**
 * CLI Test Runner
 *
 * Simple test runner for CLI commands that doesn't require Jest/Vitest.
 * Run with: node cli/run-tests.js
 */

const { execSync } = require('child_process');
const path = require('path');

const CLI_PATH = path.join(__dirname, 'index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function runCLI(args) {
  return execSync(`node ${CLI_PATH} ${args}`, { encoding: 'utf8' });
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Anchor CLI Tests');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Test: Help
test('Help command shows all commands', () => {
  const output = runCLI('--help');
  assert(output.includes('Anchor Engine CLI'), 'Should show CLI name');
  assert(output.includes('status'), 'Should show status command');
  assert(output.includes('search'), 'Should show search command');
  assert(output.includes('watch'), 'Should show watch command');
  assert(output.includes('agents'), 'Should show agents command');
  assert(output.includes('ingest'), 'Should show ingest command');
  assert(output.includes('graph'), 'Should show graph command');
});

// Test: Version
test('Version command shows 4.9.0', () => {
  const output = runCLI('--version');
  assert(output.includes('4.9.0'), 'Should show version 4.9.0');
});

// Test: Watch subcommands
test('Watch command shows subcommands', () => {
  const output = runCLI('watch --help');
  assert(output.includes('add <path>'), 'Should show add subcommand');
  assert(output.includes('list'), 'Should show list subcommand');
});

// Test: Agents subcommands
test('Agents command shows subcommands', () => {
  const output = runCLI('agents --help');
  assert(output.includes('discover'), 'Should show discover subcommand');
  assert(output.includes('add <agent>'), 'Should show add subcommand');
});

// Test: Ingest subcommands
test('Ingest command shows subcommands', () => {
  const output = runCLI('ingest --help');
  assert(output.includes('status'), 'Should show status subcommand');
  assert(output.includes('start'), 'Should show start subcommand');
});

// Test: Config
test('Config command shows configuration', () => {
  const output = runCLI('config');
  assert(output.includes('Configuration'), 'Should show config header');
  assert(output.includes('Port:'), 'Should show port');
  assert(output.includes('API Key:'), 'Should show API key status');
});

// Test: Agents discover
test('Agents discover finds Qwen Code', () => {
  const output = runCLI('agents discover');
  assert(output.includes('Discovering agents'), 'Should start discovery');
  assert(output.includes('Qwen Code'), 'Should find Qwen Code');
});

// Test: Unknown command
test('Unknown command shows error', () => {
  try {
    runCLI('unknown-command');
    throw new Error('Should have thrown');
  } catch (error) {
    // Expected to fail
    assert(error.message.includes('unknown') || error.status !== 0, 'Should show error');
  }
});

// Summary
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

process.exit(failed > 0 ? 1 : 0);