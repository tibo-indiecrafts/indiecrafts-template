# CLAUDE.md template

Stamp this when a new unit (app, package, module) lands, so its `CLAUDE.md` follows the house
shape instead of drifting. Full system → [`docs/shared/tooling/claude-md-system.md`](../../../../docs/shared/tooling/claude-md-system.md).

```bash
mkdir -p <unit>/.claude
cp method/shared/templates/claude-md/CLAUDE.md <unit>/.claude/CLAUDE.md
# then fill the <placeholders>, fix relative depth, and register the unit (_registry.md + docs page + sidebar + area changelog)
```

Keep it **short and specific** (aim < ~100 lines): exact versions, a real structure tree,
**verifiable** NEVERs (an agent must be able to tell if a rule was followed), and pointers —
not prose. Concrete wrong→right examples belong in a `.claude/rules/code-patterns.md`, which
auto-loads in the subtree.

Bare `<unit>/CLAUDE.md` and `<unit>/.claude/CLAUDE.md` are interchangeable; we use `.claude/` so
nested **rules** live beside it. **Skills, agents, and `settings.json` stay at the repo root** —
skills/agents are discovered by walking up from your start dir (nest them and they vanish unless
you launch inside that subtree), and settings load only from the start dir.
