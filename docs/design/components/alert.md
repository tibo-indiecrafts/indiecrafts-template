# Alert

> shadcn `alert` · `src/user-interface/ui/alert.tsx`

**Use when** a persistent, in-context message needs the user's attention tied to content already on the page (validation summary, plan limit, config warning). **Don't** use it for transient feedback (use a toast/snackbar), blocking decisions with 2+ actions (use a dialog), or a single form-field error (use inline field text).

## Anatomy

- **Leading icon** (optional, Lucide 16px, `aria-hidden`) — reinforces intent; never the sole signal.
- **Title** (`AlertTitle`) — one line, `font-medium`, `line-clamp-1`.
- **Description** (`AlertDescription`) — body copy, `text-muted-foreground`, wraps multiple lines/`<p>`.
- **Action** (optional) — at most one link/button; two+ actions means you want a dialog.

Grid auto-adjusts: icon column appears only when a direct `>svg` child is present.

## Variants

| Variant       | Use for                                          | Base (Tailwind defaults + tokens)                                                           |
| ------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `default`     | Neutral info / notice (the everyday case)        | `bg-card text-card-foreground`, `border`, `rounded-lg`, description `text-muted-foreground` |
| `destructive` | Error / failure only — data loss, blocked action | `bg-card text-destructive`, `[&>svg]:text-current`, description `text-destructive/90`       |

Repo ships only these two. For **success / warning** tones, don't invent a variant with raw hex — the shadcn pattern is per-instance `className` (e.g. a `text-warning`/`text-success` semantic token if `DESIGN.md` defines one). If the role is missing, propose the token in `DESIGN.md` first.

## States

- **static** — Alert is non-interactive by default; no hover/active on the container.
- **focus-visible** — only on the optional action/dismiss control: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`.
- **error** — expressed via the `destructive` variant, not a state class.

No hover, disabled, or loading state — an alert is a display surface, not a control.

## Hierarchy

One alert per view or per section, placed directly above the content it concerns (top of page, below the header, for page-level). Stacking multiples buries the signal — consolidate or prioritize.

## Restrictions

- Never rely on color alone — pair every variant with an icon **and** clear title text (WCAG; `verify:contrast`).
- Never use `destructive` for warnings or success — it is error-only (per repo token rules).
- Never put multiple actions inside an alert — that's a dialog.
- Never use an alert for time-out feedback — that's a toast; the alert is persistent until the user resolves or dismisses it.
- Never inline the copy — title/description strings live in `messages/<locale>.json`.
- Never hardcode a tone color (`bg-amber-50`, `#…`) — use a semantic token or add one.
- Mind `role="alert"`: the component hardcodes an **assertive** live region (interrupts screen readers). Correct for errors that appear dynamically; for a static, non-urgent notice consider `role="status"`/`region` via `className`-adjacent override at the call site.

## Tokens

- **Color:** `bg-card` / `text-card-foreground` (default) · `text-destructive` (destructive) · `text-muted-foreground` (description) · `border-border` (via `border`).
- **Radius:** `rounded-lg` (0.75rem).
- **Elevation:** flat — border only, no shadow.
- **Type:** `text-sm`, title `font-medium tracking-tight`, description `leading-relaxed`.
- **Icon:** Lucide, `size-4` (16px), `text-current`, `aria-hidden`.
- **Focus:** `focus-visible:ring-2 ring-ring` — on the action/dismiss control only.
- **Motion:** none by default; if entrance-animating a dynamic alert, ≤240ms `ease-out`, guard with `motion-reduce:`.

Sources:

- https://ui.shadcn.com/docs/components/alert
- https://carbondesignsystem.com/components/notification/usage/
- https://m2.material.io/components/banners
- https://polaris.shopify.com/components/banner
- https://atlassian.design/components/inline-message/usage
