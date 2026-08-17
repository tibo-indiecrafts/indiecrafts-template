# Engineering principles

**Simple yet hyper-scalable, easy to maintain.** Scale comes from simple parts
composed at clean seams — never from clever monoliths. Read before every build; the
`tech-debt.md` gate enforces it.

## Karpathy rules (adapted from his engineering philosophy)

1. **Don't trust — verify.** Systems fail silently. Check every step, add asserts,
   keep tight feedback loops. A green run is not a correct run until you've looked.
2. **Understand deeply first.** Become one with the problem and its data before you
   build. Most bugs are misunderstandings, not typos.
3. **Thin end-to-end skeleton, then a dumb baseline.** Wire the whole path in its
   simplest form and get it working before optimizing any single part.
4. **Don't be a hero.** Use the simplest approach that works. Complexity is a last
   resort you justify, not a default you reach for.
5. **Make it work → make it right → make it fast.** In that order, never skipped.
6. **Keep the codebase small and legible.** Less code = fewer bugs — and it fits in
   an LLM's context, so the next change is easier too. Deletion beats addition.

## Simple, scalable, maintainable (the doctrine)

- **Module independence** — each module is a black box with a clear API. (wahio)
- **Single responsibility** — one module, one purpose. (wahio)
- **Primitive-first** — simple, consistent data types over bespoke shapes. (wahio)
- **Composition over complexity** — build complex features from simple parts. (wahio)
- **High-scale mindset** — choose solutions that are easy to maintain and last in
  time. (wahio)
- **Reuse before create; delete over add** — climb the ladder, stop at the first
  rung that holds. (ponytail)
- **Scale = clean seams, not complexity** — expandability is "add one file + one
  index line" (`feature-architecture.md`), never a bigger monolith.

## Concrete standards (mined from `../wahio` + indiecrafts `CLAUDE.md`)

- Components < 200 lines; page templates < 150. Split at the natural seam.
- Function **cognitive complexity ≤ 15** (SonarQube S3776) — extract when over.
- TypeScript strict; **no `any`** without a one-line justification.
- Tests for new behavior; **80% coverage** target (see `testing.md`).
- Accessibility **WCAG 2.1 AA**.
- JSDoc for complex functions; keep user-facing strings translated (no inline copy).
- Never remove `async`/`await` just to satisfy lint — a broken loading state is worse
  than a warning.
- Commit when the todo is done, in logical chunks.

See also: `tech-debt.md` (the gate that enforces this), `feature-architecture.md`
(the seams), `engineering-standards.md` (Definition of Done).
