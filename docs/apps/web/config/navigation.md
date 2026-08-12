# Navigation (header + footer menus)

The header menu and the footer columns are **edited in Sanity**, not in code — one
`navigation` singleton owns both. It is the **sole runtime source**: there is no config
fallback (same contract as the [SEO surface](../seo/editing-seo-in-sanity.md)). Empty in
Sanity → the header shows just the logo and the footer just the social block. `pnpm seed`
populates a starter menu.

Edit it in the Studio under **Navigation** (`/studio` → Navigation). Read at request time by
`getNavigation(locale)` in `src/lib/navigation.ts` (React `cache()`, empty-on-error).

## The model

One language-independent document with per-language labels:

- **Header menu** — an ordered list of links shown in the top bar.
- **Footer columns** — each column has a title and a list of links.

Every link (`navItem`) is:

| Field | What it does |
| --- | --- |
| `label` | The text the visitor reads — **one line per language** (`localeString`). |
| `linkType` | **Page du site** (internal) or **URL externe** (external). |
| `route` | Internal target — a dropdown of the site's pages (the `pages` map keys). |
| `external` | External target — a full URL. |
| `newTab` | Open in a new tab (recommended for external links). |
| `icon` | _Header dropdowns only._ A free-text [Reicon](https://reicon.dev) name. |
| `description` | _Header dropdowns only._ A short line under the label (`localeString`). |
| `children` | _Header only._ A submenu — turns this item into a dropdown. |

Internal links reference the **route key**, not a hard-coded path, so a link survives a slug
change and is localized automatically at render time.

## Internal vs external

- **Internal** — pick a page from the `route` dropdown. `getNavigation` resolves it to the
  route key; `<Link>` from `@/i18n/routing` localizes the final URL per language
  (`/blog` → `/fr/blog` in French).
- **External** — paste a full `https://…` URL, rendered with a plain `<a>`. Turn on **new
  tab** for outbound links.

## Flag-gating (no dead links)

Internal links are gated by the same feature flags as the routes themselves. `getNavigation`
looks the route key up in the `pages` map and drops it when `isPageVisible` is false (e.g.
**CGV** with `features.legal.sales` off, or any blog route with `features.blog` off) — the
item silently disappears, no 404. Toggle the flag on and the link comes back. You don't have
to prune the menu when you flip a flag.

## Dropdowns + rich links (header only)

A header item with **children** becomes a dropdown: its own link is ignored and its label
becomes the trigger. A group with no live child (all its links flag-gated away) drops
entirely. Each child link can carry an **icon** and a **description**, rendered as a rich link
in the dropdown panel (shadcn `NavigationMenu`).

- **Icons** are free-text Reicon names (e.g. `ShieldCheck`, `Rocket`) — see
  [reicon.dev](https://reicon.dev) for the exact export name. An unknown or empty name simply
  renders no icon.
- Icons + descriptions only show in header dropdowns; the footer stays flat text.

## How it renders

The layout calls `getNavigation(locale)` and passes the resolved menu to `<Header>` (items)
and `<Footer>` (columns). Each raw item resolves per locale
(`label[locale] ?? label[defaultLocale]`); items with no usable label or target drop. The
resolver returns typed `NavLeaf` / `NavGroup` / `FooterColumn` shapes.

## Seeding

`pnpm seed` writes a starter `navigation` doc: a **Home + Blog** header with a demo
**Resources** dropdown (two rich external links), and a **Legal** footer column listing the
five legal pages. Re-running updates it in place.

## Not editable here

The **maker credit** in the footer (`madeBy` in `@indiecrafts/config`,
`code/packages/config/src/index.ts`) is fixed in config on purpose — it must survive a client
rebrand — so it is not part of the Sanity `navigation` doc.
