> shadcn `message-scroller` · `src/user-interface/ui/message-scroller.tsx`

**Use when** rendering a chat/AI transcript that must pin to the live edge as replies stream in. **Don't** use it for ordinary page scroll, feeds, or any list where the newest item isn't the focus — a plain scroll container is correct there.

## Anatomy

- **MessageScrollerProvider** — owns scroll state (opening position, auto-scroll, turn anchoring, prepended history, visibility). Wraps everything.
- **MessageScroller** (Root) — the height-constrained frame; `flex flex-col overflow-hidden min-h-0`.
- **MessageScrollerViewport** — the actual scrollable element; preserves visible rows when older messages prepend.
- **MessageScrollerContent** — the transcript column (`flex flex-col gap-8`), live-region for new turns.
- **MessageScrollerItem** — one transcript row; enables measurement, anchoring, and jump. Pass a stable `messageId`.
- **MessageScrollerButton** — floating "jump to latest / to start" control, centered over the viewport edge.

## Variants

| Variant                 | Use for                                  | Base (Tailwind defaults + tokens)                                                                      |
| ----------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Follow (auto-scroll on) | Live/streaming assistant replies         | Provider `autoScroll`; viewport pins to bottom only while reader is at the live edge                   |
| Static transcript       | Finished conversation, read-only history | Provider without `autoScroll`; opens at bottom, never chases new content                               |
| Jump button — end       | Reader scrolled up, new turns below      | `MessageScrollerButton direction="end"` · `variant="secondary" size="icon-sm"` · `bottom-4`, ArrowDown |
| Jump button — start     | Long transcript, back-to-top             | `direction="start"` · same button, icon rotated 180°, `top-4`                                          |

## States

- **button active/inactive** — `data-[active=true]` fades/slides in (opacity + translate-y); `data-[active=false]` sets `opacity-0 scale-95 pointer-events-none` and unfocusable (`tabIndex=-1`). Never render a dead button.
- **hover** (button) — `hover:bg-muted hover:text-foreground`.
- **focus-visible** (button) — inherits `focus-visible:ring-2 ring-ring outline-none` from `Button`. Required.
- **autoscrolling** — `data-autoscrolling` during the programmatic glide to latest; hides the scrollbar (`scrollbar-none`) so the motion reads clean.
- **streaming** — content carries `aria-busy` while a turn generates; announce via the live region, not a spinner over text.
- **loading older** (prepend) — viewport keeps the current row fixed; don't animate height on inserted rows (use transform/opacity).

## Hierarchy

One per view — it is the primary surface of a chat screen. The jump button is the only floating control over it; keep it clear of the composer.

## Restrictions

- Never force scroll-to-bottom on every token while the reader has scrolled up — auto-scroll follows only from the live edge, and any wheel/touch/keyboard/drag releases it. Re-arm only via `scrollToEnd` / the button.
- Never let the jump control cover the message composer or the newest row.
- Never show a bare chevron with no signal — label it ("Scroll to end" via `sr-only`, or a "new messages" count); silent arrivals above the fold are the classic failure.
- Never mount it in an unconstrained-height parent — the frame needs `min-h-0` / a fixed or flex height or it won't scroll.
- Never animate row height/margin/padding on entrance (layout jank); transform + opacity only.
- Never reach into `src/user-interface/ui/**` to restyle — pass `className`/`variant`/`size` props.
- Reuse stable `messageId`s so prepended history doesn't jump.

## Tokens

- **Color** — `bg-background` / `text-foreground` frame; button `bg-background border-border`, `hover:bg-muted`. No `bg-brand` (navigation control, not a primary action).
- **Radius** — button inherits `rounded-md` from `Button`.
- **Elevation** — flat frame; the fade mask (`scroll-fade-b`) signals more content, not a shadow. Button reads as a small raised chip via its own border.
- **Focus** — `focus-visible:ring-2 ring-ring outline-none` (from `Button`).
- **Motion** — button in/out `duration-200` (`≤240ms` layout budget), asymmetric ease (ease-out enter / ease-in leave); auto-scroll glide guarded so it stays subtle. Add `motion-reduce:` guards if you extend the animation.
- **Icon** — Lucide `ArrowDownIcon`, `aria-hidden` (the `sr-only` span is the label); `size="icon-sm"`.
- **Spacing** — rows `gap-8`; button offset `bottom-4` / `top-4`.

Sources:

- https://ui.shadcn.com/docs/components/base/message-scroller
- https://aiuxplayground.com/pattern/scroll-bottom/
- https://tuffstuff9.hashnode.dev/intuitive-scrolling-for-chatbot-message-streaming
- https://jhakim.com/blog/handling-scroll-behavior-for-ai-chat-apps
