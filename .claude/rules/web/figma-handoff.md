---
paths:
  - "code/{projects,packages,modules}/web/**/*.tsx"
description: Convert Figma / library sections to template conventions.
---

# Figma → template handoff

Load when translating a Figma design (or MCP-pulled Figma data) into code. Map Figma artifacts to the template's single sources of truth — don't invent parallel ones.

| From Figma                    | Goes to                                                 | Not to                          |
| ----------------------------- | ------------------------------------------------------- | ------------------------------- |
| Color / type / spacing styles | `DESIGN.md` tokens → `globals.css` (OKLCH) + `@/config` | a new `design-tokens.json`      |
| A component                   | `src/user-interface/` (reuse/adapt first)               | a fresh one-off                 |
| Copy / labels                 | `messages/<locale>.json`                                | inline strings                  |
| Icon                          | Lucide / Reicon (existing sets)                         | a new icon set or Unicode glyph |
| Nav / links                   | `@/config` + `@/i18n/routing`                           | `next/link`                     |

**Rules**

- Frames map to **sections** (`src/user-interface/**/sections/`), not one giant page.
- Match Figma's naming to the template's: PascalCase components, semantic token roles (a Figma "Primary/500" → `brand`, not `blue-500`). See the `naming` rule.
- A Figma value that has no token yet → propose a token in `DESIGN.md`, don't hardcode the hex. See the `design-token-usage` rule.
- Verify the result at 375 / 768 / 1280; the live lint cards + `typescript-lsp` plugin + the commit hook cover tsc/lint (no manual `verify:quick` needed).
