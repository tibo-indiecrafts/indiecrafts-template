> shadcn `avatar` · `src/user-interface/ui/avatar.tsx`

**Use when** representing a single user, project, or entity as a small image with a text/icon fallback. **Don't** use it as a button, a decorative image, or to show more than a handful stacked — reach for `AvatarGroup` past ~3.

## Anatomy

- **Root** (`Avatar`) — fixed-size circle, `overflow-hidden`, clips whatever it contains.
- **Image** (`AvatarImage`) — the photo; renders only after it loads, else nothing shows.
- **Fallback** (`AvatarFallback`) — initials (2 max) or a Lucide icon; shown while/if the image is missing or failing.
- **Badge** (`AvatarBadge`, optional) — small presence/status dot pinned bottom-right, ringed against the background.
- **Group** (`AvatarGroup` + `AvatarGroupCount`, optional) — overlapping stack with a trailing `+N` overflow count.

## Variants

The component has no `variant` axis — it is always a circle. "Variants" are the fallback content type you put inside.

| Variant  | Use for                                     | Base (Tailwind defaults + tokens)                                    |
| -------- | ------------------------------------------- | -------------------------------------------------------------------- |
| Image    | Real profile photo                          | `AvatarImage` — `aspect-square size-full`, 1:1 only                  |
| Initials | Person, no photo                            | `AvatarFallback` — `bg-muted text-muted-foreground`, 2 chars max     |
| Icon     | Generic/anonymous user or non-person entity | `AvatarFallback` with a Lucide icon (`User`, `Users`), `aria-hidden` |

Shape is fixed to `rounded-full`. If you need a rounded-square for a project/org/group (a real cross-system convention), that is a deliberate override on the specific instance — do not fork the component.

## Sizes

Driven by the `size` prop (`data-size` → drives Root, Fallback text, Badge, and Group count together).

| Size      | Height           | Fallback text | Badge                 |
| --------- | ---------------- | ------------- | --------------------- |
| `sm`      | `size-6` (24px)  | `text-xs`     | `size-2`, icon hidden |
| `default` | `size-8` (32px)  | `text-sm`     | `size-2.5`            |
| `lg`      | `size-10` (40px) | `text-sm`     | `size-3`              |

Below 24px, drop the second initial. Never stretch — the container is 1:1; a non-square image will crop, not letterbox.

## States

Avatar is presentational, so most interaction states don't apply — it has no hover/active/disabled of its own.

- **loading** — image not yet loaded: fallback shows automatically (Radix `AvatarFallback`, optional `delayMs` to avoid a flash). No spinner.
- **error** — image 404/failed: same fallback path; never leaves an empty circle.
- **focus-visible** — only when the avatar is itself interactive (wrapped in a link/button): `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none` on the wrapper, not the Avatar.
- **status** (via `AvatarBadge`) — presence must carry meaning beyond color: pair the dot with an icon or an accessible label; never signal online/away/busy by hue alone.

## Hierarchy

A quiet identity marker — it sits beside a name/title, never competing with it. One per row (list item, comment, nav); use `AvatarGroup` when several belong together.

## Restrictions

- Never make the bare `Avatar` clickable — wrap it in a routed `Link`/`Button` so it gets focus, keyboard, and a ring.
- Never distort the 1:1 ratio or hand it a non-square image expecting fit — it crops.
- Never put more than 2 characters in the fallback, and never spell out full names.
- Never rely on the image rendering — always provide a fallback (initials or icon); an avatar with no fallback is an empty hole when offline/404.
- Never signal status by the badge color alone (accessibility) — add icon/shape/label.
- Never hard-code a background/text hex for the fallback — use `bg-muted` / `text-muted-foreground`.
- Never stack more than ~3 raw avatars manually — use `AvatarGroup` with `AvatarGroupCount` for the overflow.
- Give a standalone avatar meaningful `alt`; give one paired with visible name text an empty `alt=""` to avoid double-announcing; mark decorative fallback glyphs `aria-hidden`.

## Tokens

- **Color:** fallback `bg-muted` + `text-muted-foreground`; badge `bg-primary` (map to `bg-brand`/`text-brand-foreground` for a brand dot) + `ring-background`; group rings `ring-background`.
- **Radius:** always `rounded-full`.
- **Elevation:** flat — no shadow. Separation in a group comes from `ring-2 ring-background`, not a shadow.
- **Type:** fallback initials `text-sm` (`text-xs` at `sm`) — caption scale, not a heading.
- **Focus:** none on the Avatar itself; `focus-visible:ring-2 focus-visible:ring-ring` on the interactive wrapper only.
- **Motion:** none by default (Radix fallback `delayMs` handles the swap); no enter/leave animation.
- **Icons:** Lucide, `aria-hidden`, sized by the size axis (badge glyph auto-hidden at `sm`).

Sources:

- https://design.gitlab.com/components/avatar/
- https://base.uber.com/6d2425e9f/v/0/p/572f13-avatar
- https://www.telerik.com/design-system/docs/components/avatar/usage/
- https://atlassian.design/components/avatar
- https://component.gallery/components/avatar/
