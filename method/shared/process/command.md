# Commands — indiecrafts.dev template

Every command for working in this repo, split by concern. Project-specific up
top; general Claude Code commands below. Personal/global tooling inventory lives
outside the repo → `~/.claude/COMMANDS.md`, `~/.claude/TOOLING.md`.

---

## 1. Project scripts (`pnpm`)

### Dev & build

| Script         | Does                                                      |
| -------------- | --------------------------------------------------------- |
| `pnpm dev`     | Dev server — http://localhost:3000                        |
| `pnpm build`   | Production build (prerenders every static route × locale) |
| `pnpm start`   | Serve the build (smoke-test prod locally)                 |
| `pnpm analyze` | `ANALYZE=1 next build` — bundle report                    |

### Quality gates (run before push)

| Script                           | Does                                                                  |
| -------------------------------- | --------------------------------------------------------------------- |
| `pnpm verify:quick`              | `tsc + lint` — **pre-push minimum**                                   |
| `pnpm verify`                    | Full CI gate: `tsc + lint + format:check + contrast + doctor:changed` |
| `pnpm tsc`                       | Types, no emit                                                        |
| `pnpm lint` / `lint:fix`         | eslint (jsx-a11y errors)                                              |
| `pnpm format` / `format:check`   | prettier                                                              |
| `pnpm verify:contrast`           | WCAG AA on theme tokens (run after any color change)                  |
| `pnpm doctor` / `doctor:changed` | React Doctor — full / changed-only                                    |
| `pnpm shadscan`                  | shadcn/ui fundamentals audit — scores UX 0–100 (62 rules)             |

### Docs (VitePress, isolated npm package)

`pnpm docs:install` (once) · `pnpm docs` (→ :3002) · `pnpm docs:build`

### Data / tooling

`pnpm seed` (47 demo docs) · `pnpm codegraph:init` / `codegraph:status` (opt-in code index)

---

## 2. Project Claude tooling (`.claude/`, committed)

### Skills — describe the task or invoke by name

| Skill                 | Use when                                                           |
| --------------------- | ------------------------------------------------------------------ |
| `design-system-check` | Before shipping UI — tokens, reuse, contrast vs `DESIGN.md`        |
| `accessibility-pass`  | Before shipping a page — structure, keyboard, contrast, responsive |
| `visual-polish`       | Screen works but needs to feel crafted (rhythm, restraint, motion) |
| `react-doctor`        | Finishing a feature / before committing React                      |

### Agents — separate context window (isolation/parallel)

`design-system-reviewer` · `accessibility-reviewer` · `ux-reviewer`

### Rules — `method/apps/web/rules/`, loaded on demand

`naming` · `accessibility` · `component-architecture` · `design-token-usage` · `figma-handoff`

### Context files

`CLAUDE.md` (how to code) · `DESIGN.md` (visual tokens) · `MEMORY.md` (decisions) ·
`CHANGELOG.md` (what/why) · `CLAUDE.local.md` (personal, gitignored)

---

## 3. Ship this project (gstack sprint)

`/office-hours` → `/autoplan` → build → `/review` `/cso` → `/qa <url>` →
`/ship` → `/land-and-deploy` → `/retro`. Full method: `~/.claude/GSTACK-SPRINT.md`.
`/design-review` for UI QA · `/codex` second opinion.

---

## 4. All Claude Code commands (built-in)

Every native slash command + bundled skill. Source: `code.claude.com/docs/en/commands`. Type `/help` for the live set.

### Context & memory

| Command                         | Purpose                                                   |
| ------------------------------- | --------------------------------------------------------- |
| `/clear` (`/reset`,`/new`)      | New conversation, empty context                           |
| `/compact [instructions]`       | Summarize conversation to free context                    |
| `/autocompact [auto\|<tokens>]` | Set the auto-compact window                               |
| `/context [all]`                | Grid of what fills the context window + optimization tips |
| `/rewind` (Esc×2)               | Roll code/conversation back to a checkpoint               |
| `/export [file]` · `/copy [N]`  | Export conversation / copy last response                  |
| `/focus`                        | Show only last prompt + final response                    |
| `/memory`                       | Edit `CLAUDE.md` memory files                             |

### Session, routing & agents

| Command                                                           | Purpose                                                     |
| ----------------------------------------------------------------- | ----------------------------------------------------------- |
| `/resume`                                                         | Return to an earlier conversation                           |
| `/fork [prompt]`                                                  | Copy conversation into a new background session             |
| `/branch [name]`                                                  | Branch point to explore a different direction               |
| `/background` (`/bg`) · `/subtask`                                | Detach as background agent / hand a side task to a subagent |
| `/tasks`                                                          | List background work incl. finished subagents               |
| `/agents`                                                         | Manage subagent configs                                     |
| `/list-agents` (`/peers`)                                         | List subagents/sessions Claude can message                  |
| `/btw [question]`                                                 | Quick side question, not added to history                   |
| `/plan` · `/goal [condition]`                                     | Enter plan mode / keep working until a condition is met     |
| `/cd <path>` · `/add-dir <path>`                                  | Move session dir / add a working dir                        |
| `/remote-control` · `/teleport` · `/desktop` (`/app`) · `/mobile` | Continue/pull session across devices                        |

### Model & mode

| Command                      | Purpose                              |
| ---------------------------- | ------------------------------------ |
| `/model [model]`             | Switch Claude model                  |
| `/effort [level\|auto]`      | low·medium·high·xhigh·max·ultracode  |
| `/fast [on\|off]`            | Toggle fast mode                     |
| `/advisor [model\|off]`      | Second-model guidance                |
| `/vim` · `/color` · `/focus` | vim keys / prompt color / focus view |

### Config & setup

| Command                                                 | Purpose                              |
| ------------------------------------------------------- | ------------------------------------ |
| `/config` (`/settings`)                                 | Settings interface / set preferences |
| `/permissions`                                          | Approval rules + permission modes    |
| `/hooks`                                                | View hook configs for tool events    |
| `/keybindings` · `/terminal-setup` · `/ide` · `/chrome` | Shortcuts / terminal / IDE / Chrome  |
| `/mcp [reconnect\|enable\|disable]`                     | Manage MCP servers + OAuth           |
| `/login` · `/logout`                                    | Sign in / out                        |
| `/install-github-app` · `/install-slack-app`            | Install GitHub / Slack apps          |

### Diagnostics & meta

| Command                                   | Purpose                                |
| ----------------------------------------- | -------------------------------------- |
| `/doctor` (`/checkup`)                    | Setup + config health/cost audit       |
| `/status` · `/usage` (`/cost`)            | Session status / token usage + cost    |
| `/insights`                               | Report on sessions, patterns, friction |
| `/debug` · `/heapdump`                    | Debug logging / heap snapshot          |
| `/diff`                                   | Interactive uncommitted-changes viewer |
| `/help` · `/feedback` · `/exit` (`/quit`) | Help / feedback / quit                 |
| `/init`                                   | Generate `CLAUDE.md`                   |

### Bundled skills

| Skill                                                                        | Purpose                                                        |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `/code-review` (`/review`) `[level] [--fix] [--comment] [pr#\|branch\|path]` | Review diff/PR for bugs + cleanup; `ultra` = deep cloud review |
| `/security-review`                                                           | Scan diff for vulnerabilities                                  |
| `/pr-comments`                                                               | Post review findings as inline PR comments                     |
| `/autofix-pr [prompt]`                                                       | Web session watches a PR, pushes fixes when CI fails           |
| `/verify`                                                                    | Verify code quality + correctness                              |
| `/batch <instruction>`                                                       | Large change → 5–30 parallel units (branch + PR each)          |
| `/deep-research <question>`                                                  | Fan-out web research → cited report                            |
| `/dataviz [request]`                                                         | Chart/dashboard design guidance                                |
| `/loop [interval] [prompt]` (`/proactive`)                                   | Run a prompt on a schedule                                     |
| `/fewer-permission-prompts`                                                  | Allowlist common calls into project settings                   |
| `/claude-api [migrate\|…]`                                                   | Claude API reference / migration / prompt audit                |
| `/design-sync` · `/design-login`                                             | Upload repo design system to Claude Design                     |

## 5. Installed extras (this machine)

Behavior: `/caveman lite\|full\|ultra\|off` · `/ponytail lite\|full\|ultra\|off` ·
`/storm:storm <topic>` · `frontend-design`.

Skill libraries (trigger by description): firecrawl, shadcn, vercel, netlify,
docx/pdf/canvas-design, deep-research, youtube-transcript, teach, skill-creator,
designer-skills, inclusive-design, ai-design, pm-skills, superpowers, n8n.

List all: `claude plugin list` · discover: `find-skills` · full inventory: `~/.claude/TOOLING.md`.
