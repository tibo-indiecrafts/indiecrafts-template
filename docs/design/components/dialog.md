# Dialog

> shadcn `dialog` · `src/user-interface/ui/dialog.tsx`

**Use when** a focused task or decision must interrupt the flow and block the page until resolved (confirm, edit, short form). **Don't** use for non-blocking feedback (toast), inline validation, contextual menus, or content that belongs on its own page.

## Anatomy

- **Overlay / scrim** — `bg-black/50`, dims and inert-ifies the page behind.
- **Content container** — centered card holding everything below.
- **Header** — `DialogTitle` (required, the accessible name) + `DialogDescription` (required unless you pass `aria-describedby`).
- **Close (×)** — top-right icon button, present by default (`showCloseButton`).
- **Body** — the task content (form, text, list). Scrolls when tall.
- **Footer** — actions, right-aligned on `sm+`; primary action is the rightmost button.

## Variants

Not a `cva` axis — variants are compositional. Pick by intent.

| Variant       | Use for                             | Base (Tailwind defaults + tokens)                                             |
| ------------- | ----------------------------------- | ----------------------------------------------------------------------------- |
| Informational | acknowledge/read then dismiss       | default `DialogContent`; footer one `Button` (Close)                          |
| Transactional | confirm a reversible action         | footer: `variant="outline"` cancel + `bg-brand text-brand-foreground` primary |
| Destructive   | irreversible / data loss            | primary swaps to the error button; label the verb (`Delete`), never `OK`      |
| Non-modal     | background stays interactive (rare) | pass `modal={false}` on `Dialog`; keep it small, dismissible                  |

Full-screen takeover on mobile is a **Sheet/Drawer**, not this component.

## Sizes

No size prop. Width is the only axis — override `max-w-*` on `DialogContent` (base is `w-full max-w-[calc(100%-2rem)] sm:max-w-lg`). Height is intrinsic; cap tall bodies with `max-h-[85dvh] overflow-y-auto` on the body, not the container.

| Width   | Class on `DialogContent` | Use for                          |
| ------- | ------------------------ | -------------------------------- |
| Compact | `sm:max-w-sm`            | single confirm/alert             |
| Default | `sm:max-w-lg` (base)     | most dialogs, short forms        |
| Wide    | `sm:max-w-2xl`           | dense forms, side-by-side fields |

## States

- **Enter / leave** — `data-[state=open]:animate-in fade-in-0 zoom-in-95` / `data-[state=closed]:animate-out fade-out-0 zoom-out-95`, `duration-200`. Add `motion-reduce:animate-none` if you extend it.
- **Close button hover** — `opacity-70 hover:opacity-100 transition-opacity`.
- **Close button focus** — `focus:ring-2 focus:ring-ring` (built in). All footer buttons must carry `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`.
- **Loading** (async submit) — disable the primary + set `aria-busy`, keep the dialog open; never close optimistically before the action resolves.
- **Error** — surface inline inside the body (text + icon), not color alone; do not auto-dismiss on failure.

## Hierarchy

Top of the z-stack (`z-50`) — one dialog per view. Never stack a dialog over a dialog; replace content or route to a page instead.

## Restrictions

- **Never** render `DialogContent` without a `DialogTitle` — Radix throws and screen readers get no name. Wrap it in `sr-only` if the design hides it.
- **Never** nest or open a second dialog from within one.
- **Never** use vague action labels (`OK`, `Done`, `Yes`) — use the verb (`Save`, `Delete`, `Discard`).
- **Never** put the destructive action on the right-as-primary without making it the error button, and never make destructive the default-focused button.
- **Never** hand-roll the overlay, focus-trap, Escape, or return-focus — Radix owns them. Don't add `onKeyDown` Escape handlers.
- **Never** block Escape / outside-click dismissal for routine dialogs; only guard against data loss (confirm-on-close), and say so.
- **Never** hard-code hex/px — use the tokens below and `max-w-*` utilities.

## Tokens

- **Color** — surface `bg-background text-foreground`; scrim `bg-black/50`; title `text-foreground`, description `text-muted-foreground`; primary action `bg-brand text-brand-foreground`; destructive action = error button only.
- **Radius** — `rounded-lg` (0.75) on the container; close button `rounded-xs`.
- **Elevation** — overlay tier: `shadow-lg` + `border border-border`.
- **Spacing** — `p-6`, `gap-4` (grid), footer `gap-2`; close button inset `top-4 right-4`.
- **Type** — title `title` role (`text-lg font-semibold leading-none`); description/body `text-sm`.
- **Focus** — `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` on every interactive element.
- **Motion** — `duration-200`, ease-out enter / ease-in leave; guard extensions with `motion-reduce:`.
- **Icons** — Lucide `XIcon` at `size-4` (compact), `aria-hidden`; the `<span class="sr-only">Close</span>` is the label.

Sources:

- https://ui.shadcn.com/docs/components/dialog
- https://www.radix-ui.com/primitives/docs/components/dialog
- https://carbondesignsystem.com/components/modal/usage/
- https://m3.material.io/components/dialogs/guidelines
