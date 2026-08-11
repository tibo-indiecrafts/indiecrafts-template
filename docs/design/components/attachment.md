# Attachment

> shadcn `attachment` · `src/user-interface/ui/attachment.tsx`

**Use when** representing a single uploaded/attached file as a compact card — icon or thumbnail, name, size, and a remove/download action. **Don't** use it as the drop target itself (that's a dropzone/`input[type=file]`) or as a generic list-item, chip, or tag.

## Anatomy

- `AttachmentTrigger` — full-card overlay link/dialog opener (optional; sits under actions)
- `AttachmentMedia` — leading icon (default) or `image` thumbnail; shows the spinner during progress
- `AttachmentContent`
  - `AttachmentTitle` — file name, truncated (shimmers while uploading/processing)
  - `AttachmentDescription` — type · size metadata, muted, truncated
- `AttachmentActions` → `AttachmentAction` — remove / retry / download buttons (stay clickable above the trigger)
- `AttachmentGroup` — scroll-snapping horizontal row wrapping multiple attachments

## Variants

| Variant                              | Use for                           | Base (Tailwind defaults + tokens)                           |
| ------------------------------------ | --------------------------------- | ----------------------------------------------------------- |
| Root card                            | every attachment                  | `bg-card text-card-foreground rounded-xl border`            |
| `orientation="horizontal"` (default) | lists, chat composers, dense rows | media beside content, `min-w-40 items-center`               |
| `orientation="vertical"`             | gallery / thumbnail grids         | media stacked above content, `w-24 flex-col`                |
| media `icon` (default)               | non-visual files (pdf, doc, zip)  | Lucide file glyph, `size-4`, `bg-muted` tile                |
| media `image`                        | images with a preview             | `object-cover` thumbnail, dims to `opacity-60` until `done` |

## Sizes

| Size      | Media tile                 | Padding       | Text      |
| --------- | -------------------------- | ------------- | --------- |
| `default` | `w-10` (40px)              | `px-2.5 py-2` | `text-sm` |
| `sm`      | `w-8` (32px)               | `px-2 py-1.5` | `text-xs` |
| `xs`      | `w-7` (28px), `rounded-lg` | `px-1.5 py-1` | `text-xs` |

## States

Driven by the `state` prop (`idle · uploading · processing · error · done`), not by color alone.

- **hover** (interactive card) — `hover:bg-muted/50` (only when it wraps a link/button)
- **focus-visible** — `focus-within:ring-1 focus-within:ring-ring/50` on the card; each `AttachmentAction` keeps its own `focus-visible:ring-2 ring-ring`
- **idle** — dashed border (`border-dashed`), image media at full opacity (empty/awaiting slot)
- **uploading / processing** — title `shimmer`; `AttachmentMedia` shows the spinner
- **error** — `border-destructive/30`, media tile `bg-destructive/10 text-destructive`, description `text-destructive/80`; pair with a retry action and a plain-language reason (wrong type, over size limit)
- **done** — settled card, image media at `opacity-100`

## Hierarchy

A per-file object, never the primary action — the page's primary CTA stays `bg-brand`. Group many with `AttachmentGroup` (horizontal scroll) or a vertical stack; keep the attachment card visually below headings and above the submit control.

## Restrictions

- Never use it as the dropzone — it's the result card, not the input. Wrap a real `input[type=file]`/dropzone above it.
- Never signal error with red alone — keep the icon/text reason; the token pair already does color + text.
- Never let the file name push the card wide — `AttachmentTitle`/`Description` already `truncate`; don't remove it or set `whitespace-nowrap` overflow.
- Never hard-code the file icon color, tile size, or radius — vary only through `size`/`orientation`/`variant`.
- Never nest an `AttachmentAction` outside `AttachmentActions` — it must stay in the `z-20` layer above `AttachmentTrigger`, or the overlay eats the click.
- Never swap `destructive` for `brand`/other tokens on the error state — error is the destructive/error role only.
- Don't inline the file name or "Remove" label — user-facing strings live in `messages/<locale>.json`.

## Tokens

- **Color** — `bg-card` / `text-card-foreground` (card), `bg-muted` + `text-foreground` (media tile), `text-muted-foreground` (description), `border-border`; error = `destructive` role only (`border-destructive/30`, `bg-destructive/10`, `text-destructive`). No `brand` — it's not a primary action.
- **Radius** — card `rounded-xl`; media tile `rounded-lg` (`rounded-md` at `xs`).
- **Elevation** — flat: `border` + `focus-within:ring-1 ring-ring/50` only, no shadow (it's an inline object, not an overlay).
- **Type** — title `font-medium` (`caption`-scale `text-xs`–`text-sm`); description `caption` (muted, `text-xs`).
- **Focus** — `focus-within:ring` on the card; `AttachmentAction` inherits Button's `focus-visible:ring-2 ring-ring outline-none`.
- **Motion** — `transition-colors` (~160ms) for hover/state tint; `shimmer` for progress; guard bespoke animation with `motion-reduce:`.
- **Icons** — Lucide, `size-4` default / `size-3.5` at `xs` / `size-6` when vertical; `aria-hidden` unless it's the only label.

Sources:

- https://ui.shadcn.com/docs/components/radix/attachment
- https://carbondesignsystem.com/components/file-uploader/usage/
- https://www.telerik.com/design-system/docs/components/upload/usage/
- https://m3.material.io/components/chips/guidelines
