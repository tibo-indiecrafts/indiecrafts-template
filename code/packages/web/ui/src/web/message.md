# Message

> shadcn `message` · `src/user-interface/ui/message.tsx`

**Use when** rendering a turn in a conversation thread (chat, AI assistant, comment log) — a sender's avatar, name, and content stacked in a scrollable list. **Don't** use it for a single system notice (use `alert`), an ephemeral confirmation (use a toast), or an inline validation string (use `field`/`FormMessage`).

## Anatomy

- `MessageGroup` — vertical stack of turns (`flex flex-col gap-2`); wraps the whole thread.
- `Message` — one turn; `align="start"` (incoming, left) or `align="end"` (outgoing, right, `flex-row-reverse`).
- `MessageAvatar` — round sender image/initials, `self-end`, `min-w-8`. Optional.
- `MessageContent` — the bubble(s) + rich content column (`gap-2.5`, wraps long words).
- `MessageHeader` — sender name / label above content (`text-xs text-muted-foreground`). Optional.
- `MessageFooter` — timestamp + actions (copy, retry, rate) below content. Optional.

## Variants

| Variant                                              | Use for                               | Base (Tailwind defaults + tokens)                                                      |
| ---------------------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------- |
| `align="start"` (incoming)                           | Assistant / other participant         | left-aligned; bubble `bg-muted text-foreground rounded-lg`                             |
| `align="end"` (outgoing)                             | The current user's own turns          | right-aligned (`flex-row-reverse`); bubble `bg-brand text-brand-foreground rounded-lg` |
| `variant="ghost"` (on `Message`, via `data-variant`) | Assistant prose with no bubble chrome | no fill; header/footer padding collapses to `px-0`                                     |

The bubble fill lives on your `MessageContent` child, not the primitive — apply `rounded-lg px-4 py-2` + the token above. Never fill both sides the same color; alignment alone must not be the only distinction (see Restrictions).

## Sizes

(no size axis — content-driven; cap bubble width at `max-w-[75%]` desktop / `max-w-[85%]` mobile so lines stay readable)

## States

- **loading / streaming** — show a typing indicator or streamed text as an incoming `Message`; wrap the streaming region in `aria-live="polite"` so it is announced. Never leave the thread silent while waiting.
- **error / failed send** — pair an error affordance with the failed turn: `text-error` label + retry action in `MessageFooter`, not a red bubble alone (color is not the only signal).
- **focus-visible** — any interactive footer action (copy, retry, avatar link) gets `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`.
- **hover** — reveal footer actions on `sm:` and up only (`group-hover/message:`); on touch they stay visible (hover is not an affordance on touch).
- No `disabled`/`active` on the container itself — those belong to the buttons inside the footer.

## Hierarchy

A thread is a flat vertical list — one `MessageGroup` per conversation, many `Message` per view. Group consecutive same-sender turns tightly (`gap-2`) and only show the avatar/header on the first of a run.

## Restrictions

- Never distinguish sender by color alone — always pair fill with alignment **and** avatar/name (WCAG: not color-only).
- Never right-align the assistant or left-align the user — the left=other / right=self convention is load-bearing; don't invent your own.
- Never let a bubble span full width — cap at `max-w-[75%]`; full-width kills scannability.
- Never hard-code sender labels, timestamps, or action text — route through `messages/<locale>.json`.
- Never use `next/link` for an avatar/profile link — use `@/i18n/routing`.
- Never stream new content into the DOM without an `aria-live` region — screen readers miss silent updates.
- Never reach into `[data-slot]` internals to restyle — pass `className`; component classes come first, yours win.

## Tokens

- **Color** — incoming `bg-muted`/`text-foreground`; outgoing `bg-brand`/`text-brand-foreground`; labels `text-muted-foreground`; error `text-error`; hairline `border-border`.
- **Radius** — bubble `rounded-lg`; avatar `rounded-full`.
- **Elevation** — flat; the thread lives on the page ground, no shadow (shadows are for overlays).
- **Type** — content = body; header/footer = caption (`text-xs text-muted-foreground`).
- **Focus** — `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` on every interactive child.
- **Motion** — new-turn/stream reveal ≤160ms `ease-out`, guarded with `motion-reduce:transition-none`.
- **Icons** — Lucide, 16px in footer actions, 2px stroke, `aria-hidden` unless the sole label.

Sources:

- https://carbondesignsystem.com/community/patterns/chatbot/usage/
- https://www.aiuxdesign.guide/guides/conversational-ui-guide/anatomy-of-a-chat-interface
- https://www.telerik.com/design-system/docs/components/chat/
- https://www.uxpin.com/studio/blog/chat-user-interface-design/
