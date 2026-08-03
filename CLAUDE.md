@AGENTS.md

# Dependency Graph

Before tracing imports or answering "what uses X / what does Y import":
1. `bun scripts/graph.ts --json | bun -e "..."` — query pre-built graph; do NOT grep or Read to discover deps
2. Focused: `bun scripts/graph.ts --focus <path> --out /tmp/g.html`
3. Changed only: `bun scripts/graph.ts --changed --json`

Graph resolves `@/` and `@payload-config` aliases; covers all source files in `src/`.

# Source of Truth

- Remaining spots live on `destinations.spots_available` / `spotsTotal` — check the destinations table, not orders.
- Product stock: the static `inStock` product files are authoritative, NOT the DB `stockLevel` column.
- Trip/product copy not present in `translations.ts` is CMS-stored in Payload — edit it in the admin panel, not in code.
- Business-rule logic (early-bird pricing, spot availability, installment eligibility) is frequently duplicated across UI components, floating bars, checkout, and server-side webhook recomputation. Before changing any of it, grep the entire repo for every occurrence and list file:line before editing.

# Deployment & Migrations

- Deploys go through CI/CD only. Never scp/rsync files to the server, never run a manual build/restart on prod.
- For schema changes: write and register a Payload migration in-repo AND apply the equivalent additive-only SQL (ALTER TABLE ... ADD COLUMN / CREATE TABLE IF NOT EXISTS) directly to prod via `ssh sons`, so CI/CD and live state stay in parity. Never DROP/TRUNCATE/destructive ALTER without explicit confirmation.
- Any migration touching a collection must also add the corresponding `payload_locked_documents_rels` columns, or the admin panel goes blank.
- Never claim a fix is "done" without evidence: `npx tsc --noEmit` output, a live DB query result, or an actual HTTP/db row. After any logic fix, show the grep sweep confirming no sibling occurrence was missed.

# Engineering Standard

- Work silently; provide only one final response after the task is complete.
- Focus exclusively on the requested coding task.
- Inspect the relevant source, configuration, runtime behavior, and tests before editing.
- Read the applicable Next.js documentation in `node_modules/next/dist/docs/` before changing Next.js APIs.
- Implement the smallest production-grade solution that fully addresses the requirement.
- Preserve existing behavior unless the task requires a behavior change.
- Use strict TypeScript types; do not add `any`, unsafe casts, ignored errors, or placeholder implementations.
- Validate all external input at system boundaries and handle expected failure paths explicitly.
- Protect secrets, user data, authorization boundaries, payment flows, and webhook behavior.
- Avoid silent fallbacks that can hide production failures; log actionable errors with safe context.
- Do not add premature abstractions, compatibility layers, or dependencies without a concrete need.
- Follow existing project conventions for naming, formatting, architecture, caching, and data access.
- Update related tests when behavior changes and add regression coverage for fixed bugs.
- Run the narrowest relevant checks first, then the full build or test suite when practical.
- Review the final diff for correctness, security, performance, accessibility, and unrelated changes.
- Never commit, push, deploy, or modify secrets unless explicitly requested.
- Final output must contain only changed paths, verification results, and blocking issues.
