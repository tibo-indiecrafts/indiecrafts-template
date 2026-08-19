# Adding a skill or agent

How to extend the toolkit without letting it rot. The default is **register, don't
vendor** — a skill copied into this repo drifts from its upstream the day you copy it.
Vendor only what's genuinely repo-specific.

Claude Code discovers both **flat, at the repo root only**:
`.claude/skills/<name>/SKILL.md` and `.claude/agents/<name>.md` (plus
`.claude/settings.json`). Nested folders are **not** discovered — the per-step
structure lives in the [registry](./my-skills-and-agents.md), not in folders.

## 1. Decide: `[local]` or register-global

|             | `[local]` — vendor in `.claude/`                                             | register-global                                                   |
| ----------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **When**    | encodes _this repo's_ conventions; self-contained; useless outside this repo | reusable anywhere; a machine-wide plugin or gstack skill          |
| **Example** | a `page-builder-reviewer` for the Sanity page-builder                        | `frontend-design`, `ponytail-audit`, `/qa`                        |
| **Cost**    | travels with a clone; **you** maintain it                                    | zero maintenance; a machine prerequisite (`project-bootstrap.md`) |
| **Risk**    | drift if it duplicates a global                                              | absent on a fresh machine until installed                         |

Rule of thumb: **if a second project would want it, don't vendor it** — register it and
list the install in [`project-bootstrap.md`](./project-bootstrap.md). Today only
4 skills + 3 agents clear the `[local]` bar.

## 2. Author it

Use the global authoring skills — don't hand-roll frontmatter:

- **`skill-creator`** `[plugin]` — create from scratch, edit, optimize the
  `description:` for trigger accuracy, run evals.
- **`writing-skills`** `[plugin]` — create/edit/verify a skill before deployment.
- **`find-skills`** `[plugin]` — check a global one doesn't already exist first (it
  usually does — reach for it before writing).

A skill is a `SKILL.md` with `name:` + a trigger-focused `description:` (the model
reads the description to decide when to load it — make it match how you'd ask). An
agent is a single `.md` with its own tools + system prompt (separate context window;
use for isolation/parallelism).

## 3. Place it (only if `[local]`)

- Skill → `.claude/skills/<name>/SKILL.md` (+ any scripts/refs in that folder).
- Agent → `.claude/agents/<name>.md`.
- Keep it self-contained — no runtime dep on anything outside the clone.

## 4. Wire it up

- **Register** in [`my-skills-and-agents.md`](./my-skills-and-agents.md): add one line
  under the phase(s) it serves (02_THINK … 08_REFLECT), source-tagged
  `[local]`/`[gstack]`/`[plugin]`/`[global]`. This is required for **both** local and
  registered tools — the registry is the map.
- If it's a **global prerequisite**, add a row to
  [`project-bootstrap.md`](./project-bootstrap.md) so a fresh repo knows to install it.

## 5. Verify

- `/context` lists the skill/agent as loaded.
- Trigger test: phrase a request the way a user would and confirm it fires (skills are
  description-gated — if it doesn't trigger, tighten the `description:` via
  `skill-creator`).
- For `[local]`: `git status` shows it under `.claude/` (the `.gitignore` keeps
  `.claude/*` out **except** `agents/`, `skills/`, `settings.json`).

## Don't

- **Don't vendor a global** to "keep it close" — it drifts and duplicates. Register it.
- **Don't build a skill for a one-off** — that's a prompt, not a skill (YAGNI).
- **Don't nest** under `.claude/` expecting discovery — it's flat only.
