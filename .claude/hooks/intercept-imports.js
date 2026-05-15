#!/usr/bin/env node
/**
 * PreToolUse hook — intercepts Bash grep/find for import/dependency searches.
 * Reads from .claude/graph-cache.json (pre-built, always fresh after commits).
 * Zero file parsing at query time.
 */

const input = JSON.parse(process.env.CLAUDE_TOOL_INPUT || '{}');
const cmd = (input.command || '');
const lower = cmd.toLowerCase();

const isImportGrep = lower.includes('grep') && (
  lower.includes('import') || lower.includes("from '") || lower.includes('from "') ||
  lower.includes('require(') || lower.includes('export')
);
const isTsFind = (lower.startsWith('find ') || lower.includes(' find ')) &&
  (lower.includes('.ts') || lower.includes('.tsx')) && !lower.includes('node_modules');

if (!isImportGrep && !isTsFind) process.exit(0);

const { readFileSync } = require('fs');
const { join } = require('path');

const ROOT = '/Users/stanchito/sons-of-mountains';
const CACHE = join(ROOT, '.claude/graph-cache.json');

let graph;
try { graph = JSON.parse(readFileSync(CACHE, 'utf8')); }
catch { process.exit(0); } // cache missing — allow original command

const byId = new Map(graph.nodes.map(n => [n.id, n]));
const imports = new Map();
const usedBy = new Map();
graph.edges.forEach(e => {
  if (!imports.has(e.source)) imports.set(e.source, []);
  if (!usedBy.has(e.target)) usedBy.set(e.target, []);
  imports.get(e.source).push(e.target);
  usedBy.get(e.target).push(e.source);
});

// Extract path hint from command
const pathMatch = cmd.match(/src\/[^\s'"]+/);
const lines = [`GRAPH CACHE (${graph.fileCount} files, built ${graph.builtAt.slice(0,16)}):`];

if (pathMatch) {
  const partial = pathMatch[0];
  const focusNode = graph.nodes.find(n => n.id.includes(partial) || n.id.endsWith(partial));
  if (focusNode) {
    lines.push(`FILE: ${focusNode.label} [${focusNode.group}]`);
    const imp = imports.get(focusNode.id) || [];
    const used = usedBy.get(focusNode.id) || [];
    lines.push(`IMPORTS (${imp.length}): ${imp.map(id => byId.get(id)?.label || id).join(', ')}`);
    lines.push(`USED BY (${used.length}): ${used.map(id => byId.get(id)?.label || id).join(', ')}`);
  } else {
    // partial match — list all matching files
    const matches = graph.nodes.filter(n => n.id.includes(partial));
    lines.push(`MATCHES for "${partial}" (${matches.length}):`);
    matches.slice(0, 20).forEach(n => lines.push(`  ${n.id} [${n.group}]`));
  }
} else if (isTsFind) {
  // find command without specific file — return file list by group
  const byGroup = new Map();
  graph.nodes.forEach(n => {
    if (!byGroup.has(n.group)) byGroup.set(n.group, []);
    byGroup.get(n.group).push(n.id);
  });
  lines.push(`ALL FILES (${graph.nodes.length}) by group:`);
  for (const [group, ids] of [...byGroup.entries()].sort()) {
    lines.push(`  [${group}] ${ids.length} files`);
    ids.slice(0, 5).forEach(id => lines.push(`    ${id}`));
    if (ids.length > 5) lines.push(`    ...+${ids.length - 5} more`);
  }
} else {
  const inDeg = new Map();
  graph.edges.forEach(e => inDeg.set(e.target, (inDeg.get(e.target) || 0) + 1));
  lines.push('TOP IMPORTED:');
  [...inDeg.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)
    .forEach(([id, n]) => { const node = byId.get(id); if (node) lines.push(`  ${n}x ${node.label} [${node.group}]`); });
}

lines.push('');
lines.push('Targeted query: bun scripts/graph.ts --focus <path> --json');

process.stderr.write(lines.join('\n') + '\n');
process.exit(1);
