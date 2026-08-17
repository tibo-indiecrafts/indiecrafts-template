# method — the dev framework (read-mostly canon)

Auto-loads when you work under `method/**`. _How we work_, foldered like the code:
`shared/` (cross-cutting — `process/` 7-phase sprint, `engineering/` brain, `templates/`,
`context/`), `apps/web/` (`rules/` + `workflows/`), `modules/ packages/ db/ infra/`.
Rendered as a VitePress site: `pnpm method` → :3003.

**Stack:** VitePress (npm-isolated). The private dev-framework site (:3003).

## Rules

- **Reference, not scratch.** Edit the concern doc your change touches; refresh from canon, don't fork a per-project copy. **Draft in `work/`, never here.**
- **Docs lockstep** — add/rename/remove a page → update the sidebar in `.vitepress/config.mts` in the same change (`ignoreDeadLinks` is on, so broken links won't fail the build — check by hand).
- **Vue parser trap** — backtick bare `<placeholders>` in Markdown, or the build chokes.
- **Templates are scaffolds** (`shared/templates/**`), excluded from the site — they're stamped into `work/`, not read as pages.
- Adding a skill/agent → `shared/process/adding-skills.md`. The registry → `shared/process/my-skills-and-agents.md`.
- **Handing a client the work → `shared/process/client-handoff.md`** — what ships (`code/` + `docs/`) vs what stays yours (`method/` · `work/` · root `.claude/` toolchain). `method/` + `work/` are gitignored, so keep all framework/process/toolchain content **here in `method/`**, never in the tracked deliverable.
- Log framework changes in `method/CHANGELOG.md`; roll up to root at release.
