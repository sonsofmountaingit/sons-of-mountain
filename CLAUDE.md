@AGENTS.md

# Component Scaffold Skill

When the user asks to create, build, add, or scaffold any new component, section, or page:
1. Read `.claude/skills/component-scaffold/SKILL.md` FIRST using the Read tool
2. Follow ALL steps in the checklist — no steps skipped
3. Use the footer implementation as the canonical reference pattern
4. Every component gets: Payload CMS fields + revalidation, /api/<name>-data route, /api/puck/<name> save route, section-split Puck blocks (one per visual section), Puck editor route at /puck/<name>, admin Visual Editor button, frontend floating edit button (admin-only), frontend RSC with unstable_cache

Skill file: `.claude/skills/component-scaffold/SKILL.md`
