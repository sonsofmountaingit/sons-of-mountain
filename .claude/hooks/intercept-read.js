#!/usr/bin/env node
/**
 * PreToolUse hook for Read tool.
 * Returns symbol index from .claude/symbol-cache.json for files >100 lines.
 * Zero file parsing at query time.
 */

const { readFileSync } = require('fs');
const { join, relative } = require('path');

const input = JSON.parse(process.env.CLAUDE_TOOL_INPUT || '{}');
const filePath = input.file_path || '';

if (!filePath.includes('/src/')) process.exit(0);
// If caller specified offset/limit they want a specific range — allow through
if (input.offset != null || input.limit != null) process.exit(0);

const ROOT = '/Users/stanchito/sons-of-mountains';
const rel = filePath.startsWith(ROOT) ? filePath.slice(ROOT.length + 1) : filePath;

let symbolCache;
try { symbolCache = JSON.parse(readFileSync(join(ROOT, '.claude/symbol-cache.json'), 'utf8')); }
catch { process.exit(0); }

const sym = symbolCache[rel];
if (!sym) process.exit(0);
if (sym.lines <= 100) process.exit(0);

const summary = [
  `FILE: ${rel} (${sym.lines} lines) [${sym.group}] — SYMBOL INDEX`,
  `Exports: ${sym.exports.join(', ') || 'none'}`,
  sym.types.length ? `Types: ${sym.types.join(', ')}` : null,
  `Imports from: ${sym.imports.slice(0, 12).join(', ')}${sym.imports.length > 12 ? '...' : ''}`,
  '',
  'Read with offset+limit for a specific section. Example:',
  `  Read(file_path="${filePath}", offset=0, limit=50)`,
].filter(Boolean).join('\n');

process.stderr.write(summary + '\n');
process.exit(1);
