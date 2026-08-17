# Decision matrix — which review/skill per change

Skill routing is context-aware. Don't run all of them on every change.

| Building for…                        | Plan (pre-code)                               | Live audit (post)                                                                     |
| ------------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------- |
| **End users** (UI, web, mobile)      | `/plan-design-review` + `design-system-check` | `/design-review`, `visual-polish`, `accessibility-pass`, `shadscan` (shadcn UX 0–100) |
| **Developers** (API, CLI, SDK, docs) | `/plan-devex-review`                          | `/devex-review`                                                                       |
| **Architecture** (data, perf, infra) | `/plan-eng-review`                            | `/review`, `/benchmark`                                                               |
| **All three**                        | `/autoplan`                                   | —                                                                                     |
| **Anything shippable**               | —                                             | `/cso` (security), `/qa` (test)                                                       |

Skip rules: CEO review skips backend-only; design review skips infra fixes;
`/cso` always before ship; `/qa` diff-aware runs automatically on feature branches.

Lazy default: `/office-hours` → `/autoplan` → build → `/review` → `/qa` → `/ship`
→ `/retro`. Add the rest only when the change type calls for it.

**Agents behind the commands** (full per-phase map → [`my-skills-and-agents.md`](./my-skills-and-agents.md)):
`/cso` → `security-auditor`/`penetration-tester`; `/benchmark` → `performance-benchmarker`;
`/review` on a page-builder block → `page-builder-reviewer`; on app config/UI → `config-consistency-reviewer`.
The template-tuned reviewers live in `.claude/agents/project/`; the general suite is vendored under
`.claude/agents/<topic>/`.
