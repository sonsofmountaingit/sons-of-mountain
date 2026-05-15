#!/usr/bin/env bun
/**
 * Dependency graph for sons-of-mountains.
 * Outputs a self-contained HTML file with an interactive force-directed graph.
 * No API calls, no LLM, pure static analysis.
 *
 * Usage:
 *   bun scripts/graph.ts [--out graph.html] [--focus src/components/ui/Navigation.tsx]
 *
 * Options:
 *   --out <path>      output HTML file (default: graph.html)
 *   --focus <path>    highlight a file and show only its neighbourhood (optional)
 *   --depth <n>       neighbourhood depth when --focus is set (default: 2)
 *   --changed         show only files changed in the working tree (git status)
 *   --json            dump raw graph JSON to stdout instead of HTML
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, relative, dirname, extname, join } from "path";
import { readdirSync, statSync, existsSync } from "fs";
import { execSync } from "child_process";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ROOT = resolve(import.meta.dir, "..");
const SRC = join(ROOT, "src");

const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];
const IGNORED_DIRS = new Set(["node_modules", ".next", ".git", "dist", "build"]);

// Path aliases from tsconfig
const ALIASES: Record<string, string> = {
  "@/": "src/",
  "@payload-config": "src/payload/payload.config.ts",
};

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const getArg = (flag: string): string | undefined => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : undefined;
};
const hasFlag = (flag: string) => args.includes(flag);

const outFile = getArg("--out") ?? "graph.html";
const focusArg = getArg("--focus");
const depthArg = parseInt(getArg("--depth") ?? "2", 10);
const jsonOnly = hasFlag("--json");
const changedOnly = hasFlag("--changed");

// ---------------------------------------------------------------------------
// File discovery
// ---------------------------------------------------------------------------

function walkDir(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (IGNORED_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...walkDir(full));
    } else if (EXTENSIONS.includes(extname(full))) {
      results.push(full);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Import resolution
// ---------------------------------------------------------------------------

function resolveAlias(importPath: string): string {
  for (const [alias, target] of Object.entries(ALIASES)) {
    if (alias.endsWith("/") && importPath.startsWith(alias)) {
      return join(ROOT, target, importPath.slice(alias.length));
    }
    if (!alias.endsWith("/") && importPath === alias) {
      return join(ROOT, target);
    }
  }
  return importPath;
}

function resolveImport(importPath: string, fromFile: string): string | null {
  // Skip external modules
  if (!importPath.startsWith(".") && !importPath.startsWith("@/") && importPath !== "@payload-config") {
    return null;
  }

  const resolved = resolveAlias(importPath);
  const base = resolved.startsWith("/") ? resolved : join(dirname(fromFile), resolved);

  // Try exact match first
  if (existsSync(base) && !statSync(base).isDirectory()) return base;

  // Try with extensions
  for (const ext of EXTENSIONS) {
    const candidate = base + ext;
    if (existsSync(candidate)) return candidate;
  }

  // Try index files
  for (const ext of EXTENSIONS) {
    const candidate = join(base, `index${ext}`);
    if (existsSync(candidate)) return candidate;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Import extraction (regex — no parser dep)
// ---------------------------------------------------------------------------

const IMPORT_RE = /(?:import|export)\s+(?:[^'"`;]*\s+from\s+)?['"`]([^'"`]+)['"`]/g;
const REQUIRE_RE = /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
const DYNAMIC_RE = /import\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;

function extractImports(content: string, fromFile: string): string[] {
  const imports: string[] = [];
  const seen = new Set<string>();

  for (const re of [IMPORT_RE, REQUIRE_RE, DYNAMIC_RE]) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(content)) !== null) {
      const resolved = resolveImport(m[1], fromFile);
      if (resolved && !seen.has(resolved)) {
        seen.add(resolved);
        imports.push(resolved);
      }
    }
  }

  return imports;
}

// ---------------------------------------------------------------------------
// Build graph
// ---------------------------------------------------------------------------

type Node = { id: string; label: string; group: string; size: number };
type Edge = { source: string; target: string };
type Graph = { nodes: Node[]; edges: Edge[] };

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

function buildGraph(files: string[]): Graph {
  const fileSet = new Set(files);
  const inDegree: Map<string, number> = new Map();
  const edges: Edge[] = [];

  files.forEach(f => inDegree.set(f, 0));

  for (const file of files) {
    const content = readFileSync(file, "utf8");
    const imports = extractImports(content, file);
    for (const imp of imports) {
      if (fileSet.has(imp) && imp !== file) {
        edges.push({ source: file, target: imp });
        inDegree.set(imp, (inDegree.get(imp) ?? 0) + 1);
      }
    }
  }

  const nodes: Node[] = files.map(f => {
    const rel = relative(ROOT, f);
    const parts = rel.split("/");
    const label = parts.slice(-2).join("/"); // last 2 segments for readability
    return {
      id: f,
      label,
      group: groupOf(rel),
      size: Math.max(4, Math.min(20, (inDegree.get(f) ?? 0) * 2 + 4)),
    };
  });

  return { nodes, edges };
}

// ---------------------------------------------------------------------------
// Neighbourhood filter
// ---------------------------------------------------------------------------

function neighbourhood(graph: Graph, focusId: string, depth: number): Graph {
  const adjacency: Map<string, Set<string>> = new Map();
  for (const { source, target } of graph.edges) {
    if (!adjacency.has(source)) adjacency.set(source, new Set());
    if (!adjacency.has(target)) adjacency.set(target, new Set());
    adjacency.get(source)!.add(target);
    adjacency.get(target)!.add(source);
  }

  const visited = new Set<string>();
  let frontier = [focusId];
  for (let d = 0; d <= depth; d++) {
    for (const n of frontier) visited.add(n);
    frontier = frontier.flatMap(n => [...(adjacency.get(n) ?? [])]).filter(n => !visited.has(n));
  }

  const nodes = graph.nodes.filter(n => visited.has(n.id));
  const edges = graph.edges.filter(e => visited.has(e.source) && visited.has(e.target));
  return { nodes, edges };
}

// ---------------------------------------------------------------------------
// Changed files (git)
// ---------------------------------------------------------------------------

function changedFiles(): Set<string> {
  try {
    const out = execSync("git -C " + ROOT + " status --porcelain", { encoding: "utf8" });
    const files = new Set<string>();
    for (const line of out.split("\n")) {
      const parts = line.trim().split(/\s+/);
      const rel = parts[parts.length - 1];
      if (rel) files.add(join(ROOT, rel));
    }
    return files;
  } catch {
    return new Set();
  }
}

// ---------------------------------------------------------------------------
// HTML template
// ---------------------------------------------------------------------------

function buildHtml(graph: Graph, focusId: string | null): string {
  const graphJson = JSON.stringify(graph);
  const focusJson = JSON.stringify(focusId);

  const groups = [...new Set(graph.nodes.map(n => n.group))].sort();
  const palette = [
    "#e63946","#457b9d","#2a9d8f","#e9c46a","#f4a261","#264653",
    "#8ecae6","#219ebc","#023047","#ffb703","#fb8500","#606c38",
    "#dda15e","#bc6c25","#9b2226","#ae2012","#bb3e03","#ca6702",
  ];
  const colorMap: Record<string, string> = {};
  groups.forEach((g, i) => { colorMap[g] = palette[i % palette.length]; });
  const colorMapJson = JSON.stringify(colorMap);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sons of Mountains — Dependency Graph</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:system-ui,sans-serif;background:#0f1117;color:#e2e8f0;height:100vh;display:flex;flex-direction:column}
  #header{padding:12px 16px;background:#1a1d27;border-bottom:1px solid #2d3148;display:flex;align-items:center;gap:16px;flex-wrap:wrap}
  #header h1{font-size:15px;font-weight:600;letter-spacing:.02em}
  #header .stat{font-size:12px;color:#94a3b8}
  #controls{display:flex;gap:8px;align-items:center;margin-left:auto;flex-wrap:wrap}
  input[type=text]{background:#252836;border:1px solid #3d4166;border-radius:6px;color:#e2e8f0;padding:5px 10px;font-size:12px;width:220px}
  input[type=text]:focus{outline:none;border-color:#6366f1}
  button{background:#252836;border:1px solid #3d4166;border-radius:6px;color:#e2e8f0;padding:5px 10px;font-size:12px;cursor:pointer}
  button:hover{background:#2f3347}
  #layout{display:flex;flex:1;overflow:hidden}
  #canvas-wrap{flex:1;position:relative;overflow:hidden}
  canvas{display:block;width:100%;height:100%}
  #sidebar{width:280px;background:#1a1d27;border-left:1px solid #2d3148;overflow-y:auto;padding:12px;font-size:12px}
  #sidebar h2{font-size:13px;font-weight:600;margin-bottom:10px;color:#94a3b8}
  .node-info{margin-bottom:12px}
  .node-info .path{color:#818cf8;word-break:break-all;margin-bottom:6px}
  .node-info .group-badge{display:inline-block;padding:2px 7px;border-radius:999px;font-size:11px;margin-bottom:8px}
  .section-label{font-weight:600;color:#64748b;margin:8px 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:.06em}
  .dep-item{padding:3px 0;color:#cbd5e1;word-break:break-all;cursor:pointer}
  .dep-item:hover{color:#818cf8}
  #legend{padding:12px;border-top:1px solid #2d3148}
  #legend h2{font-size:11px;font-weight:600;color:#64748b;margin-bottom:8px;text-transform:uppercase;letter-spacing:.06em}
  .legend-row{display:flex;align-items:center;gap:6px;margin-bottom:4px;cursor:pointer;font-size:11px}
  .legend-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
  .legend-row.dimmed{opacity:.3}
  #tooltip{position:absolute;background:#1e2133;border:1px solid #3d4166;border-radius:6px;padding:6px 10px;font-size:11px;pointer-events:none;display:none;max-width:300px;word-break:break-all;z-index:10}
</style>
</head>
<body>
<div id="header">
  <h1>Sons of Mountains — Dependency Graph</h1>
  <span class="stat" id="stat-nodes"></span>
  <span class="stat" id="stat-edges"></span>
  <div id="controls">
    <input type="text" id="search" placeholder="Search file…">
    <button id="btn-reset">Reset view</button>
    <button id="btn-toggle-labels">Labels off</button>
  </div>
</div>
<div id="layout">
  <div id="canvas-wrap">
    <canvas id="c"></canvas>
    <div id="tooltip"></div>
  </div>
  <div id="sidebar">
    <div id="node-detail"><h2>Click a node to inspect</h2></div>
    <div id="legend"><h2>Groups</h2><div id="legend-rows"></div></div>
  </div>
</div>
<script>
(function(){
const GRAPH = ${graphJson};
const FOCUS_ID = ${focusJson};
const COLOR_MAP = ${colorMapJson};

// ---- state ----
let nodes = GRAPH.nodes.map(n => ({...n, x:0, y:0, vx:0, vy:0}));
let edges = GRAPH.edges;
let selectedId = FOCUS_ID;
let transform = {x:0, y:0, scale:1};
let dragging = null;
let dragStart = null;
let showLabels = true;
let hiddenGroups = new Set();
let searchTerm = '';

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const tooltip = document.getElementById('tooltip');

// ---- resize ----
function resize(){
  canvas.width = canvas.offsetWidth * devicePixelRatio;
  canvas.height = canvas.offsetHeight * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
}
window.addEventListener('resize', ()=>{ resize(); draw(); });
resize();

// ---- layout init ----
const W = () => canvas.offsetWidth;
const H = () => canvas.offsetHeight;

function initPositions(){
  // group nodes into clusters
  const groups = [...new Set(nodes.map(n=>n.group))];
  const gc = groups.length;
  nodes.forEach(n=>{
    const gi = groups.indexOf(n.group);
    const angle = (gi/gc)*Math.PI*2;
    const r = Math.min(W(),H())*0.28;
    n.x = W()/2 + r*Math.cos(angle) + (Math.random()-.5)*80;
    n.y = H()/2 + r*Math.sin(angle) + (Math.random()-.5)*80;
  });
}
initPositions();

// ---- force simulation ----
const SIM_STEPS = 180;
let simStep = 0;
const adjSet = new Set(edges.map(e=>e.source+'|'+e.target));
function isAdj(a,b){ return adjSet.has(a+'|'+b)||adjSet.has(b+'|'+a); }

function tick(){
  if(simStep >= SIM_STEPS) return;
  simStep++;
  const alpha = 1 - simStep/SIM_STEPS;
  const nodeMap = new Map(nodes.map(n=>[n.id,n]));

  // repulsion
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i], b=nodes[j];
      const dx=b.x-a.x, dy=b.y-a.y;
      const dist2=dx*dx+dy*dy+1;
      const force=1200/dist2;
      a.vx-=force*dx; a.vy-=force*dy;
      b.vx+=force*dx; b.vy+=force*dy;
    }
  }

  // attraction along edges
  for(const e of edges){
    const a=nodeMap.get(e.source), b=nodeMap.get(e.target);
    if(!a||!b) continue;
    const dx=b.x-a.x, dy=b.y-a.y;
    const dist=Math.sqrt(dx*dx+dy*dy)+0.01;
    const target=80;
    const f=(dist-target)*0.04;
    a.vx+=f*dx/dist; a.vy+=f*dy/dist;
    b.vx-=f*dx/dist; b.vy-=f*dy/dist;
  }

  // gravity to center
  for(const n of nodes){
    n.vx+=(W()/2-n.x)*0.004*alpha;
    n.vy+=(H()/2-n.y)*0.004*alpha;
  }

  // integrate + dampen
  for(const n of nodes){
    if(n===dragging) continue;
    n.x+=n.vx*0.6; n.y+=n.vy*0.6;
    n.vx*=0.7; n.vy*=0.7;
  }
}

// ---- draw ----
function visibleNodes(){ return nodes.filter(n=>!hiddenGroups.has(n.group)); }
function visibleEdges(){
  const vs = new Set(visibleNodes().map(n=>n.id));
  return edges.filter(e=>vs.has(e.source)&&vs.has(e.target));
}

function worldToScreen(wx,wy){ return {x:wx*transform.scale+transform.x, y:wy*transform.scale+transform.y}; }
function screenToWorld(sx,sy){ return {x:(sx-transform.x)/transform.scale, y:(sy-transform.y)/transform.scale}; }

function draw(){
  const w=canvas.offsetWidth, h=canvas.offsetHeight;
  ctx.clearRect(0,0,w,h);

  const vn=visibleNodes();
  const ve=visibleEdges();
  const nodeMap=new Map(nodes.map(n=>[n.id,n]));
  const selectedNode=selectedId?nodeMap.get(selectedId):null;
  const connectedIds=new Set();
  if(selectedNode){
    for(const e of edges){
      if(e.source===selectedId) connectedIds.add(e.target);
      if(e.target===selectedId) connectedIds.add(e.source);
    }
  }

  // edges
  ctx.save();
  ctx.translate(transform.x, transform.y);
  ctx.scale(transform.scale, transform.scale);

  for(const e of ve){
    const a=nodeMap.get(e.source), b=nodeMap.get(e.target);
    if(!a||!b) continue;
    const highlight = selectedId && (e.source===selectedId||e.target===selectedId);
    ctx.beginPath();
    ctx.moveTo(a.x,a.y);
    ctx.lineTo(b.x,b.y);
    ctx.strokeStyle = highlight ? '#6366f1' : 'rgba(100,116,139,0.18)';
    ctx.lineWidth = highlight ? 1.2 : 0.6;
    ctx.stroke();
  }

  // nodes
  for(const n of vn){
    const {x:sx,y:sy}=n;
    const r=n.size;
    const col=COLOR_MAP[n.group]||'#64748b';
    const isSelected=n.id===selectedId;
    const isConnected=connectedIds.has(n.id);
    const dim=selectedId&&!isSelected&&!isConnected;

    ctx.beginPath();
    ctx.arc(sx,sy,r,0,Math.PI*2);
    ctx.fillStyle=dim?col+'44':col;
    ctx.fill();
    if(isSelected){
      ctx.strokeStyle='#fff';
      ctx.lineWidth=2;
      ctx.stroke();
    } else if(isConnected){
      ctx.strokeStyle=col;
      ctx.lineWidth=1.2;
      ctx.stroke();
    }

    // labels
    if(showLabels && transform.scale > 0.5){
      const parts=n.label.split('/');
      const name=parts[parts.length-1];
      ctx.fillStyle=dim?'rgba(148,163,184,0.3)':'rgba(226,232,240,0.85)';
      ctx.font=\`\${Math.max(9,11/transform.scale)}px system-ui\`;
      ctx.textAlign='center';
      ctx.fillText(name, sx, sy+r+10/transform.scale);
    }

    // search highlight
    if(searchTerm && n.label.toLowerCase().includes(searchTerm.toLowerCase())){
      ctx.beginPath();
      ctx.arc(sx,sy,r+4,0,Math.PI*2);
      ctx.strokeStyle='#facc15';
      ctx.lineWidth=2;
      ctx.stroke();
    }
  }

  ctx.restore();
}

// ---- animation loop ----
function loop(){
  tick();
  draw();
  if(simStep<SIM_STEPS) requestAnimationFrame(loop);
  else setInterval(draw,1000/30); // light redraw for interactions
}
loop();

// ---- stats ----
document.getElementById('stat-nodes').textContent=nodes.length+' nodes';
document.getElementById('stat-edges').textContent=edges.length+' edges';

// ---- legend ----
function buildLegend(){
  const container=document.getElementById('legend-rows');
  container.innerHTML='';
  for(const [group,color] of Object.entries(COLOR_MAP)){
    const row=document.createElement('div');
    row.className='legend-row';
    row.dataset.group=group;
    row.innerHTML=\`<div class="legend-dot" style="background:\${color}"></div><span>\${group}</span>\`;
    row.addEventListener('click',()=>{
      if(hiddenGroups.has(group)) hiddenGroups.delete(group);
      else hiddenGroups.add(group);
      row.classList.toggle('dimmed');
      draw();
    });
    container.appendChild(row);
  }
}
buildLegend();

// ---- node detail panel ----
function showNodeDetail(node){
  const nodeMap=new Map(nodes.map(n=>[n.id,n]));
  const deps=edges.filter(e=>e.source===node.id).map(e=>nodeMap.get(e.target)).filter(Boolean);
  const usedBy=edges.filter(e=>e.target===node.id).map(e=>nodeMap.get(e.source)).filter(Boolean);
  const col=COLOR_MAP[node.group]||'#64748b';

  document.getElementById('node-detail').innerHTML=\`
    <h2>File info</h2>
    <div class="node-info">
      <div class="path">\${node.label}</div>
      <span class="group-badge" style="background:\${col}22;color:\${col}">\${node.group}</span>
      \${deps.length?'<div class="section-label">Imports (\${deps.length})</div>'+deps.map(d=>\`<div class="dep-item" data-id="\${d.id}">\${d.label}</div>\`).join(''):''}
      \${usedBy.length?'<div class="section-label">Used by (\${usedBy.length})</div>'+usedBy.map(d=>\`<div class="dep-item" data-id="\${d.id}">\${d.label}</div>\`).join(''):''}
    </div>
  \`;
  document.querySelectorAll('.dep-item').forEach(el=>{
    el.addEventListener('click',()=>{
      selectedId=el.dataset.id;
      const n=nodeMap.get(selectedId);
      if(n) showNodeDetail(n);
      draw();
    });
  });
}

if(FOCUS_ID){
  const n=nodes.find(n=>n.id===FOCUS_ID);
  if(n) showNodeDetail(n);
}

// ---- hit test ----
function hitTest(sx,sy){
  const {x:wx,y:wy}=screenToWorld(sx,sy);
  const vn=visibleNodes();
  for(let i=vn.length-1;i>=0;i--){
    const n=vn[i];
    const dx=n.x-wx, dy=n.y-wy;
    if(dx*dx+dy*dy<=n.size*n.size) return n;
  }
  return null;
}

// ---- mouse / touch ----
let isPanning=false, panStart={x:0,y:0}, panOrigin={x:0,y:0};

canvas.addEventListener('mousedown', e=>{
  const rect=canvas.getBoundingClientRect();
  const sx=e.clientX-rect.left, sy=e.clientY-rect.top;
  const hit=hitTest(sx,sy);
  if(hit){
    dragging=hit;
    dragStart={x:sx,y:sy};
  } else {
    isPanning=true;
    panStart={x:e.clientX,y:e.clientY};
    panOrigin={x:transform.x,y:transform.y};
  }
});

canvas.addEventListener('mousemove', e=>{
  const rect=canvas.getBoundingClientRect();
  const sx=e.clientX-rect.left, sy=e.clientY-rect.top;

  if(dragging){
    const {x:wx,y:wy}=screenToWorld(sx,sy);
    dragging.x=wx; dragging.y=wy;
    draw();
    return;
  }
  if(isPanning){
    transform.x=panOrigin.x+(e.clientX-panStart.x);
    transform.y=panOrigin.y+(e.clientY-panStart.y);
    draw();
    return;
  }

  const hit=hitTest(sx,sy);
  if(hit){
    tooltip.style.display='block';
    tooltip.style.left=(sx+14)+'px';
    tooltip.style.top=(sy+14)+'px';
    tooltip.textContent=hit.label;
    canvas.style.cursor='pointer';
  } else {
    tooltip.style.display='none';
    canvas.style.cursor='grab';
  }
});

canvas.addEventListener('mouseup', e=>{
  const rect=canvas.getBoundingClientRect();
  const sx=e.clientX-rect.left, sy=e.clientY-rect.top;
  if(dragging){
    const moved=Math.abs(sx-dragStart.x)+Math.abs(sy-dragStart.y);
    if(moved<5){
      selectedId=dragging.id;
      showNodeDetail(dragging);
    }
    dragging=null;
  }
  isPanning=false;
  draw();
});

canvas.addEventListener('wheel', e=>{
  e.preventDefault();
  const rect=canvas.getBoundingClientRect();
  const sx=e.clientX-rect.left, sy=e.clientY-rect.top;
  const {x:wx,y:wy}=screenToWorld(sx,sy);
  const delta=e.deltaY>0?0.85:1.18;
  transform.scale=Math.max(0.08,Math.min(8,transform.scale*delta));
  transform.x=sx-wx*transform.scale;
  transform.y=sy-wy*transform.scale;
  draw();
},{passive:false});

// ---- controls ----
document.getElementById('btn-reset').addEventListener('click',()=>{
  transform={x:0,y:0,scale:1};
  draw();
});

const lblBtn=document.getElementById('btn-toggle-labels');
lblBtn.addEventListener('click',()=>{
  showLabels=!showLabels;
  lblBtn.textContent=showLabels?'Labels off':'Labels on';
  draw();
});

const searchInput=document.getElementById('search');
searchInput.addEventListener('input',()=>{
  searchTerm=searchInput.value;
  draw();
});

})();
</script>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

let allFiles = walkDir(SRC);

if (changedOnly) {
  const changed = changedFiles();
  allFiles = allFiles.filter(f => changed.has(f));
  if (allFiles.length === 0) {
    console.error("No changed files found.");
    process.exit(0);
  }
}

let graph = buildGraph(allFiles);

let focusId: string | null = null;
if (focusArg) {
  focusId = resolve(ROOT, focusArg);
  if (!allFiles.includes(focusId)) {
    // try partial match
    const match = allFiles.find(f => f.includes(focusArg));
    if (match) focusId = match;
    else { console.error("Focus file not found:", focusArg); process.exit(1); }
  }
  graph = neighbourhood(graph, focusId, depthArg);
}

if (jsonOnly) {
  process.stdout.write(JSON.stringify(graph, null, 2));
  process.exit(0);
}

const html = buildHtml(graph, focusId);
const outPath = resolve(ROOT, outFile);
writeFileSync(outPath, html, "utf8");
console.log(`Graph written to ${outPath}`);
console.log(`  ${graph.nodes.length} nodes, ${graph.edges.length} edges`);

