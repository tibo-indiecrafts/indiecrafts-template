# Bubble

> shadcn `bubble` · `src/user-interface/ui/bubble.tsx`

**Use when** rendering a turn in a conversation or chat thread (one message per bubble, grouped by sender). **Don't** use it for toasts, callouts, tooltips, or generic cards — it is a message container, not a notification.

## Anatomy

- `BubbleGroup` — vertical stack of one sender's turns (`flex flex-col gap-2`).
- `Bubble` — one message row; owns `variant` + `align` (`start`=received/left, `end`=sent/right). Caps at `max-w-[80%]`.
- `BubbleContent` — the rounded, padded body that carries the message text or rich content. `asChild` to make the whole bubble a `button`/`a`.
- `BubbleReactions` — optional pill (emoji/reactions) absolutely positioned overhanging a corner of the bubble.
- (Outside the primitive) avatar + timestamp: siblings around the group, never inside `BubbleContent`.

## Variants

| Variant       | Use for                                       | Base (Tailwind defaults + tokens)                                                |
| ------------- | --------------------------------------------- | -------------------------------------------------------------------------------- |
| `default`     | The primary participant's own messages (sent) | `bg-brand text-brand-foreground` (shipped as `primary`); pair with `align="end"` |
| `secondary`   | The other participant / assistant (received)  | `bg-secondary text-secondary-foreground`; pair with `align="start"`              |
| `muted`       | Low-emphasis system/received turns            | `bg-muted text-foreground`                                                       |
| `tinted`      | Received turn wanting a hint of brand         | brand-derived low-chroma fill via `oklch(from …)`, `text-foreground`             |
| `outline`     | Received turn on a busy surface               | `bg-background border-border`                                                    |
| `ghost`       | Inline/streamed text with no container        | transparent, no radius, no padding, `max-w-full`                                 |
| `destructive` | Failed/blocked message                        | `bg-destructive/10 text-destructive` (the ONE place error color is allowed)      |

## States

- **hover** (only when `BubbleContent` is a `button`/`a`): fill darkens ~5–20% per variant via `color-mix` / opacity. Non-interactive bubbles have no hover.
- **focus-visible** (interactive only): `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50` — never remove it.
- **active / disabled / loading**: not modeled by the primitive. A streaming turn = `ghost` with your own cursor; a pending send = wrap in your own opacity, don't invent a variant.
- **error**: use `destructive` — do not repurpose another variant's color.

## Hierarchy

One `BubbleGroup` per contiguous run of same-sender turns; `default`+`end` and a received variant+`start` are the only two that should dominate a thread — reserve `destructive`/`tinted` for the rare turn.

## Restrictions

- Never right-align (`align="end"`) a received message or left-align a sent one — the align/variant pairing IS the sender signal.
- Never distinguish senders by color alone — keep the left/right alignment (WCAG, color-blind, screen readers).
- Never widen past `max-w-[80%]` (except `ghost`) — full-width bubbles kill readability.
- Never put timestamp, avatar, or read-receipt inside `BubbleContent` — they sit outside the bubble.
- Never edit this file to add a variant — extend `bubbleVariants` via `cva` (it is shadcn CLI-managed; treat as read-only per repo rules).
- Never hand-roll a chat bubble div when this primitive exists.
- Don't use `destructive` for anything but a genuinely failed/blocked message.

## Tokens

- **Color:** `bg-brand`/`text-brand-foreground` (default), `bg-secondary`, `bg-muted`, `bg-background`+`border-border`, `bg-destructive`/`text-destructive`; reactions pill `bg-muted` ring-`card`.
- **Radius:** `rounded-xl` (1rem) on `BubbleContent`; `rounded-full` on `BubbleReactions`; `ghost` = none.
- **Elevation:** flat — no shadow; `outline` reads as a hairline border only.
- **Type:** `text-sm leading-relaxed`, `wrap-break-word` (body role).
- **Focus:** `ring-ring/50` ring-3 + `border-ring` on interactive content.
- **Motion:** `transition-colors` (~160ms) on interactive hover only; guard bespoke enter animation with `motion-reduce:`.

Sources:

- https://www.aiuxdesign.guide/guides/conversational-ui-guide/anatomy-of-a-chat-interface
- https://www.uxpin.com/studio/blog/chat-user-interface-design/
