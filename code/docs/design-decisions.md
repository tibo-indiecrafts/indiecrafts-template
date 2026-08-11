# Design decisions

Why certain design choices were made — a short decision log (ADR-style) for the
visual system and UI architecture. Complements, doesn't duplicate:

- **`CHANGELOG.md`** — _what_ changed and when (code + design).
- **`DESIGN.md`** — the current token contract (the _what is_, not the _why we chose it_).
- **`docs/design/*`** — per-topic deep dives (typography, responsive, sections…).

Record a decision here when a choice is non-obvious, was contested, or a future
maintainer might otherwise "fix" it by mistake. Keep each entry tight.

---

## Template

```
### YYYY-MM-DD — <decision title>
**Context:** what forced the choice.
**Decision:** what we did.
**Why:** the reasoning / trade-off accepted.
**Alternatives rejected:** and why.
```

---

### 2026-08-10 — Removed the unused `theme.colors` / `radii` / `fonts` mirrors

**Context:** `theme.colors` (11 fields), `theme.radii`, and `theme.fonts` in
`src/config/index.ts` had **zero consumers** — an audit across `src/`, `scripts/`,
and `check-contrast.mjs` found nothing reads them. `globals.css` (oklch) is the
real runtime source; the contrast checker parses `globals.css` directly, not the
config. The OG image became a static PNG, so no `next/og`/Satori path parses
oklch anymore either.
**Decision:** Deleted `theme.colors`, `theme.radii`, `theme.fonts`, and the unused
`hexColors` fields. `theme.hexColors` keeps only `background` (the one hex the PWA
manifest needs); `theme.container` stays (read by `layout.tsx`).
**Why:** A hand-maintained mirror nobody reads is pure drift risk — it invited
`colors` and `globals.css` to disagree with no enforcement. One source is safer.
**Supersedes** the "hex mirrors for tooling" framing in the 2026-08-05 entry below:
the only surviving mirror is `hexColors.background`.

### 2026-08-05 — OKLCH is the single source of truth for color

**Context:** tokens are needed at runtime (Tailwind), in `next/og` (Satori, which
can't parse `oklch`), and in the PWA manifest.
**Decision:** OKLCH in `globals.css` is authoritative; `theme.hexColors` + the hex
in `DESIGN.md` are sRGB **mirrors** for tooling only.
**Why:** OKLCH is perceptually uniform (even dark-mode shifts); one authoritative
space avoids drift.
**Alternatives rejected:** a hand-maintained `design-tokens.json` — it would fork
the source of truth and inevitably drift. If a Figma bridge needs DTCG JSON,
generate it from the OKLCH tokens, never hand-edit.

### 2026-08-05 — Typography scale expanded to 9 named levels

**Context:** agents building an `h3`/lead/caption had no token and fell back to
defaults (`text-sm` was the most-used size with no token).
**Decision:** added `subheading`, `title`, `lead`, `caption`, each mapped to a
Tailwind size already in use.
**Why:** a named token per real size removes guesswork. **Alternatives rejected:**
leaving the gap (agents kept inventing sizes).
