# Design decisions

A short, ADR-style log of *why* non-obvious visual-system and UI-architecture
choices were made — the reasoning a future maintainer needs before they "fix"
something on purpose. It complements, never duplicates:

- **`code/apps/web/CHANGELOG.md`** — *what* changed and when (code + design share one log).
- **`code/packages/ui-tokens/DESIGN.md`** — the current token contract (the *what is*, not the *why*).
- **The topic guides in this folder** — per-subject deep dives ([typography](./typography.md), [responsive](./responsive-design.md), [sections](./sections.md), [icons](./icons.md), …).

Record a decision here when a choice was non-obvious, contested, or a maintainer
might otherwise reverse it by mistake. Keep each entry tight.

## Template

```text
### YYYY-MM-DD — <decision title>
Context:  what forced the choice.
Decision: what we did.
Why:      the reasoning / trade-off accepted.
Rejected: alternatives, and why.
```

---

### 2026-08-10 — Removed the unused `theme.colors` / `radii` / `fonts` mirrors

**Context:** `theme.colors` (11 fields), `theme.radii`, and `theme.fonts` in the
config had **zero consumers** — an audit across the app, `scripts/`, and the
contrast checker found nothing reading them. `globals.css` (OKLCH) is the real
runtime source, and the contrast checker parses `globals.css` directly, not the
config. The OG image became a Sanity asset, so no Satori path parses OKLCH either.

**Decision:** deleted `theme.colors`, `theme.radii`, `theme.fonts`, and the unused
`hexColors` fields. `theme.hexColors` now keeps only `background` (the one hex the
PWA manifest needs); `theme.container` stays (read by `layout.tsx`).

**Why:** a hand-maintained mirror nobody reads is pure drift risk — it invited
`colors` and `globals.css` to disagree with no enforcement. One source is safer.

**Supersedes** the "hex mirrors for tooling" framing in the 2026-08-05 entry: the
only surviving mirror is `theme.hexColors.background`.

### 2026-08-05 — OKLCH is the single source of truth for color

**Context:** tokens are needed at runtime (Tailwind), in the PWA manifest (which
can't take `oklch`), and previously in Satori (which also can't parse `oklch`).

**Decision:** OKLCH in `globals.css` is authoritative; `theme.hexColors` and the
hex in `DESIGN.md` are sRGB **mirrors** for tooling only.

**Why:** OKLCH is perceptually uniform (even dark-mode shifts read evenly); one
authoritative color space avoids drift.

**Rejected:** a hand-maintained `design-tokens.json` — it would fork the source of
truth and inevitably drift. If a Figma bridge ever needs DTCG JSON, generate it
from the OKLCH tokens, never hand-edit.

### 2026-08-05 — Typography scale expanded to 9 named levels

**Context:** anyone building an `h3` / lead / caption had no token and fell back
to raw Tailwind sizes (`text-sm` was the most-used size with no named token).

**Decision:** added `subheading`, `title`, `lead`, `caption` — each mapped to a
Tailwind size already in use.

**Why:** a named token per real size removes guesswork.

**Rejected:** leaving the gap — it kept producing invented, off-scale sizes.
