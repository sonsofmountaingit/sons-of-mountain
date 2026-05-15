#!/usr/bin/env bun
/**
 * Builds two persistent caches in .claude/:
 *   graph-cache.json  — full import graph (nodes + edges)
 *   symbol-cache.json — per-file export/import symbol index
 *
 * Run: bun scripts/build-cache.ts
 * Auto-run: git post-commit hook
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "fs";
import { resolve, relative, dirname, extname, join } from "path";

const ROOT = resolve(import.meta.dir, "..");
const SRC = join(ROOT, "src");
const CACHE_DIR = join(ROOT, ".claude");
const GRAPH_CACHE = join(CACHE_DIR, "graph-cache.json");
const SYMBOL_CACHE = join(CACHE_DIR, "symbol-cache.json");

const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];
const IGNORED_DIRS = new Set(["node_modules", ".next", ".git", "dist", "build"]);
const ALIASES: Record<string, string> = {
  "@/": "src/",
  "@payload-config": "src/payload/payload.config.ts",
};

function walkDir(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (IGNORED_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) results.push(...walkDir(full));
    else if (EXTENSIONS.includes(extname(full))) results.push(full);
  }
  return results;
}

function resolveAlias(p: string): string {
  for (const [alias, target] of Object.entries(ALIASES)) {
    if (alias.endsWith("/") && p.startsWith(alias)) return join(ROOT, target, p.slice(alias.length));
    if (!alias.endsWith("/") && p === alias) return join(ROOT, target);
  }
  return p;
}

function resolveImport(importPath: string, fromFile: string): string | null {
  if (!importPath.startsWith(".") && !importPath.startsWith("@/") && importPath !== "@payload-config") return null;
  const resolved = resolveAlias(importPath);
  const base = resolved.startsWith("/") ? resolved : join(dirname(fromFile), resolved);
  if (existsSync(base) && !statSync(base).isDirectory()) return base;
  for (const ext of EXTENSIONS) { const c = base + ext; if (existsSync(c)) return c; }
  for (const ext of EXTENSIONS) { const c = join(base, `index${ext}`); if (existsSync(c)) return c; }
  return null;
}

const IMPORT_RE = /(?:import|export)\s+(?:[^'"`;]*\s+from\s+)?['"`]([^'"`]+)['"`]/g;
const REQUIRE_RE = /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
const DYNAMIC_RE = /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;

function extractSymbols(content: string, file: string) {
  const lines = content.split("\n");
  const exports: string[] = [];
  const types: string[] = [];
  const imports: string[] = [];

  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith("export default ")) exports.push("default:" + t.slice(15).split(/[\s({]/)[0]);
    else if (t.match(/^export (const|function|async function|class) /)) {
      const m = t.match(/^export (?:async )?(?:const|function|class) (\w+)/);
      if (m) exports.push(m[1]);
    } else if (t.match(/^export type |^export interface /)) {
      const m = t.match(/^export (?:type|interface) (\w+)/);
      if (m) types.push(m[1]);
    } else if (t.match(/^import .* from /)) {
      const m = t.match(/from ['"]([^'"]+)['"]/);
      if (m) imports.push(m[1]);
    }
  }

  const deps: string[] = [];
  const seen = new Set<string>();
  for (const re of [IMPORT_RE, REQUIRE_RE, DYNAMIC_RE]) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(content)) !== null) {
      const resolved = resolveImport(m[1], file);
      if (resolved && !seen.has(resolved)) { seen.add(resolved); deps.push(resolved); }
    }
  }

  return { exports, types, imports, deps, lines: lines.length };
}

function groupOf(rel: string): string {
  if (rel.startsWith("src/components/admin")) return "admin";
  if (rel.startsWith("src/components/blocks")) return "blocks";
  if (rel.startsWith("src/components/ui")) return "ui";
  if (rel.startsWith("src/components")) return "components";
  if (rel.startsWith("src/app/api")) return "api";
  if (rel.startsWith("src/app/(puck)")) return "puck";
  if (rel.startsWith("src/app/(payload)")) return "payload-app";
  if (rel.startsWith("src/app/(frontend)")) return "frontend";
  if (rel.startsWith("src/app")) return "app";
  if (rel.startsWith("src/payload/collections")) return "collections";
  if (rel.startsWith("src/payload/globals")) return "globals";
  if (rel.startsWith("src/payload/blocks")) return "payload-blocks";
  if (rel.startsWith("src/payload")) return "payload";
  if (rel.startsWith("src/lib")) return "lib";
  if (rel.startsWith("src/data")) return "data";
  return "other";
}

// ---- build ----
const files = walkDir(SRC);
const fileSet = new Set(files);
const symbolCache: Record<string, { exports: string[]; types: string[]; imports: string[]; lines: number; group: string }> = {};
const edges: { source: string; target: string }[] = [];
const inDegree: Map<string, number> = new Map();

files.forEach(f => inDegree.set(f, 0));

for (const file of files) {
  const content = readFileSync(file, "utf8");
  const rel = relative(ROOT, file);
  const sym = extractSymbols(content, file);
  symbolCache[rel] = { exports: sym.exports, types: sym.types, imports: sym.imports, lines: sym.lines, group: groupOf(rel) };
  for (const dep of sym.deps) {
    if (fileSet.has(dep) && dep !== file) {
      edges.push({ source: relative(ROOT, file), target: relative(ROOT, dep) });
      inDegree.set(dep, (inDegree.get(dep) ?? 0) + 1);
    }
  }
}

const nodes = files.map(f => {
  const rel = relative(ROOT, f);
  const parts = rel.split("/");
  return { id: rel, label: parts.slice(-2).join("/"), group: groupOf(rel), size: Math.max(4, Math.min(20, (inDegree.get(f) ?? 0) * 2 + 4)) };
});

const graphCache = { nodes, edges, builtAt: new Date().toISOString(), fileCount: files.length };

writeFileSync(GRAPH_CACHE, JSON.stringify(graphCache, null, 2));
writeFileSync(SYMBOL_CACHE, JSON.stringify(symbolCache, null, 2));

console.log(`graph-cache.json: ${nodes.length} nodes, ${edges.length} edges`);
console.log(`symbol-cache.json: ${Object.keys(symbolCache).length} files indexed`);
console.log(`builtAt: ${graphCache.builtAt}`);
