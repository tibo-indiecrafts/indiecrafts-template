# Environment setup — from clone to running

Two tiers. **Tier 1 runs the app** — that's all you need to develop. **Tier 2** is
the optional, per-developer AI tooling (global, never committed).

## Tier 1 — the app (required)

```bash
# prerequisites: Node 22+, pnpm 10 (corepack enable && corepack use pnpm@10)
pnpm install
cp .env.example .env.local      # fill Sanity keys only if features.blog / studio are on
pnpm dev                        # http://localhost:3000
pnpm verify:quick               # tsc + lint (manual; commit hook already runs tsc)
```

That is a working dev environment. Nothing below is required to build or ship.

Optional app extras:

```bash
pnpm seed        # 47 demo blog docs (needs Sanity env)
pnpm docs:install && pnpm docs   # VitePress docs → http://localhost:3002
```

## Tier 2 — AI coding tooling (optional, per-developer, global)

Recommended for working with an AI agent on this repo. All global (`~/.claude`),
none committed, so client sites never depend on them. Each has its own guide:

| Tool                                               | Install                                                                            | Guide                                        |
| -------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------- |
| **CodeGraph** — semantic code index                | `npm i -g @colbymchenry/codegraph && codegraph install` then `pnpm codegraph:init` | [codegraph.md](./codegraph.md)               |
| **Headroom** — context compression                 | `pipx install "headroom-ai[all]"`                                                  | [headroom.md](./headroom.md)                 |
| **caveman + ponytail** — terse output / least code | see guide                                                                          | [behavior-plugins.md](./behavior-plugins.md) |

### Full AI toolchain (one-time, per machine)

Prerequisites for the toolchain:

```bash
curl -fsSL https://bun.sh/install | bash     # gstack needs bun
brew install yt-dlp pipx                      # youtube-transcript; headroom
```

Behavior + workflow plugins:

```bash
claude plugin marketplace add JuliusBrussee/caveman     && claude plugin install caveman@caveman
claude plugin marketplace add DietrichGebert/ponytail   && claude plugin install ponytail@ponytail
claude plugin marketplace add hadufer/claude-storm      && claude plugin install storm@storm-marketplace
claude plugin install feature-dev@claude-plugins-official
claude plugin install pr-review-toolkit@claude-plugins-official
```

Knowledge-work plugins (skip what you don't need — many need MCP connectors):

```bash
claude plugin marketplace add anthropics/knowledge-work-plugins
for p in marketing legal data productivity cowork-plugin-management; do
  claude plugin install "$p@knowledge-work-plugins"; done
```

Skills (global, on-demand — `npx skills`):

```bash
# design + build
npx -y skills add anthropics/skills --skill '*' --agent claude-code --global --yes   # frontend-design, docx, pdf, canvas-design, skill-creator…
npx -y skills add shadcn/ui@shadcn --global --yes
npx -y skills add vercel-labs/agent-skills --skill '*' --global --yes
npx -y skills add obra/superpowers --skill '*' --global --yes
# web + docs + content
npx -y skills add firecrawl/cli --skill '*' --global --yes
npx -y skills add upstash/context7 --skill find-docs --global --yes
npx -y skills add netlify/context-and-tools --skill '*' --global --yes
```

gstack (engineering sprint — see `~/.claude/GSTACK-SPRINT.md`):

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack \
  && cd ~/.claude/skills/gstack && ./setup
```

> The authoritative, always-current command list lives in `~/.claude/COMMANDS.md`
> (reproduce) and `~/.claude/TOOLING.md` (what each does). The **claude-tasks
> framework** wires these into a per-project / per-feature workflow — see its `SETUP.md`.
