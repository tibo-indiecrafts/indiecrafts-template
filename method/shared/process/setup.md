# Machine setup — once per machine

Sets up the **machine-level toolchain** the workflow assumes. Run once per dev machine;
then [`project-bootstrap.md`](./project-bootstrap.md) stands up each repo. Everything here
is **global/personal** — it never gets committed to a client repo.

## Install

| Tool                 | What                                                                                                                                                                              | Verify                                                            |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Node + pnpm**      | the workspace package manager (`pnpm@10.x`, see root `package.json` `packageManager`)                                                                                             | `pnpm -v`                                                         |
| **gstack**           | the sprint engine — installs the phase commands (`/office-hours` `/autoplan` `/review` `/qa` `/ship` `/retro` …) into `~/.claude/skills/`. State lands in `~/.gstack/`.           | the commands appear in `/context`; `~/.gstack/` exists            |
| **Behavior plugins** | `caveman` (terse output), `ponytail` (least code) — global Claude Code plugins, on every phase; `headroom` (context compression) is a separate `headroom wrap claude` CLI wrapper | `/caveman`, `/ponytail` respond; `headroom --version` for the CLI |
| **grill-me**         | THINK-phase skill — adversarial interrogation of the approach before PLAN. Install: `npx skills@latest add JuliusBrussee/skills --skill grill-me --global`                        | `grill-me` appears in `/context`                                  |
| **bun**              | fast runner some skills/scripts use                                                                                                                                               | `bun -v`                                                          |

Install gstack + the behavior plugins through your Claude Code plugin manager (they land
in `~/.claude/`, not the repo). The **registry** — which command/skill serves which phase —
is [`my-skills-and-agents.md`](./my-skills-and-agents.md).

## gstack state — how it wires in

- gstack auto-persists per project to `~/.gstack/projects/<slug>/`.
- Each sprint symlinks that in as `_gstack/` (`ln -s ~/.gstack/projects/<slug> work/apps/<app>/_gstack`).
  The link is **dangling until gstack first writes the project dir** — it resolves on the first command. Both `_gstack` and the repo-level `.gstack/` reports are gitignored.

## Done when

`pnpm -v`, `bun -v` work; the gstack phase commands resolve in `/context`; `caveman` +
`ponytail` + `headroom` are active; `~/.gstack/` exists. Then bootstrap a repo →
[`project-bootstrap.md`](./project-bootstrap.md).
