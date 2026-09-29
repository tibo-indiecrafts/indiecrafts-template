# indiecrafts.dev — Product truth

The non-visual third of the design-context triad. This file holds **what we are building
and for whom**; the visual contract lives in
[`DESIGN.md`](../../../../packages/web/ui-tokens/DESIGN.md), the build rules in
[`CLAUDE.md`](./.claude/CLAUDE.md). Read this before you design a _new_ surface — it frames
the problem the visual work then solves.

## Who it serves

Developers and small agencies shipping marketing sites and a blog for their own clients.
They want a crafted, calm, config-first template — not a page builder to babysit. They
value restraint, speed, and one home per fact.

## Purpose

Ship a client site fast without re-deciding structure, tokens, i18n, SEO, or compliance
each time. The template makes the correct path the default and the wrong path loud.

## Positioning

Quiet and editorial, the opposite of a busy SaaS marketing kit. "Restraint is the brand"
is a product stance, not only a visual one: fewer knobs, stronger defaults, no feature a
client must maintain to get value.

## Pre-design filter

Run these before designing a new surface. This is a filter, not a process — it challenges
the assumption before the pixels. Use it yourself, and hand it to the agent instead of a
bare "design X".

1. **Problem** — What problem, exactly? Who has it? Is the stated problem the real one, or
   someone's interpretation of it?
2. **Human** — What does the user already know? What mental model do they arrive with? What
   will they misread? What are they actually trying to finish?
3. **Business** — What outcome matters to us, what to the user, and are they aligned? Name
   the tension when they are not — do not pretend it away.
4. **Evidence** — Which of these are facts and which are assumptions? A confident assumption
   is still an assumption.
5. **Design** — What is the simplest version? What can be removed? Where is friction useful
   and where is it waste? How does the user know what happened, and recover from a mistake?
6. **Validation** — What is the smallest test that proves or falsifies the idea? What
   behavior would show success? Ship that, not the impressive Figma version.
7. **System** — Does this reuse an existing pattern, or create inconsistency? A perfect
   single screen can still be a bad system decision.
8. **Consequences** — Does it increase user agency or quietly reduce it? Could it manipulate
   or manufacture dependence? Design the six-months-later behavior, not just the next click.

Answer 1–8, then move to [`DESIGN.md`](../../../../packages/web/ui-tokens/DESIGN.md) for
the visual build. The thinking stays yours; the tools only go faster.
