@AGENTS.md

# Dependency Graph

Before tracing imports or answering "what uses X / what does Y import":
1. `bun scripts/graph.ts --json | bun -e "..."` — query pre-built graph; do NOT grep or Read to discover deps
2. Focused: `bun scripts/graph.ts --focus <path> --out /tmp/g.html`
3. Changed only: `bun scripts/graph.ts --changed --json`

Graph resolves `@/` and `@payload-config` aliases; covers all source files in `src/`.
