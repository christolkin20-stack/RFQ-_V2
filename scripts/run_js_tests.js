#!/usr/bin/env node
/**
 * Simple JS test runner — runs all test_rfq_*.js files in rfq/tests/
 * Each file is a standalone Node.js script using assert.
 * Exit code 0 = all pass, 1 = any failure.
 */
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const testsDir = path.resolve(__dirname, '..', 'rfq', 'tests');
const files = fs.readdirSync(testsDir)
  .filter(f => f.startsWith('test_rfq_') && f.endsWith('.js'))
  .sort();

if (files.length === 0) {
  console.error('No JS test files found in', testsDir);
  process.exit(1);
}

console.log(`Running ${files.length} JS tests...\n`);

let passed = 0;
let failed = 0;
const failures = [];

for (const file of files) {
  const filePath = path.join(testsDir, file);
  try {
    execFileSync(process.execPath, [filePath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 30000,
      cwd: path.resolve(__dirname, '..'),
    });
    passed++;
    console.log(`  ✅ ${file}`);
  } catch (err) {
    failed++;
    const stderr = err.stderr ? err.stderr.toString().trim() : '';
    const stdout = err.stdout ? err.stdout.toString().trim() : '';
    const output = stderr || stdout || 'unknown error';
    failures.push({ file, output });
    console.log(`  ❌ ${file}`);
  }
}

console.log(`\n${passed} passed, ${failed} failed out of ${files.length} tests`);

if (failures.length > 0) {
  console.log('\n--- Failure details ---');
  for (const f of failures) {
    console.log(`\n[${f.file}]`);
    console.log(f.output);
  }
  process.exit(1);
}

process.exit(0);
