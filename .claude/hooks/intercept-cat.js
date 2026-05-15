#!/usr/bin/env node
/**
 * PreToolUse hook for Bash — intercepts cat/head/tail on src/ files.
 * Returns symbol index from .claude/symbol-cache.json. Zero file parsing.
 */

const input = JSON.parse(process.env.CLAUDE_TOOL_INPUT || '{}');
const cmd = (input.command || '');

const isCat = /\bcat\b/.test(cmd) || /\bhead\b/.test(cmd) || /\btail\b/.test(cmd);
const hasSrcFile = /src\/[^\s|>&]+\.(tsx?|jsx?)/.test(cmd);
if (!isCat || !hasSrcFile) process.exit(0);

const { readFileSync } = require('fs');
const { join } = require('path');
const ROOT = '/Users/stanchito/sons-of-mountains';

let symbolCache;
try { symbolCache = JSON.parse(readFileSync(join(ROOT, '.claude/symbol-cache.json'), 'utf8')); }
catch { process.exit(0); }

const matches = [...cmd.matchAll(/src\/[^\s|>&"']+\.(?:tsx?|jsx?)/g)].map(m => m[0]);
const summaries = [];

for (const rel of matches) {
  const sym = symbolCache[rel];
  if (!sym) { summaries.push(`FILE: ${rel} — not in cache (new file?)`); continue; }

  if (sym.lines <= 60) {
    // small file — allow read through (exit 0 handles this)
    continue;
  }

  summaries.push([
    `FILE: ${rel} (${sym.lines} lines) [${sym.group}] — SYMBOL INDEX`,
    `Exports: ${sym.exports.join(', ') || 'none'}`,
    sym.types.length ? `Types: ${sym.types.join(', ')}` : null,
    `Imports from: ${sym.imports.slice(0, 10).join(', ')}`,
    'Use Read with offset+limit for specific sections.',
  ].filter(Boolean).join('\n'));
}

if (summaries.length === 0) process.exit(0);

process.stderr.write(summaries.join('\n\n') + '\n');
process.exit(1);
