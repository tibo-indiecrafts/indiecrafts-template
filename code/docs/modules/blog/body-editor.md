# Body editor reference

Everything you can insert into a post body in the Studio.

The body editor is Sanity's Portable Text canvas, configured by `code/modules/web/blog/src/sanity/schema/blockContent.ts`. On the live site the body renders inside a `.prose prose-neutral dark:prose-invert` wrapper — the visual styling of paragraphs, headings, lists, marks, and blockquotes comes from `@tailwindcss/typography` (via `@indiecrafts/ui-tokens/globals.css`). `code/modules/web/blog/src/user-interface/renderers/portable-text-components.tsx` overrides only what the plugin can't infer from markup: deterministic heading `id`s (so the TOC can anchor), the external-link `target`, inline images, and inline modules.

To see every primitive in one place, open the seeded showcase post at `/en/blog/<slug>` (or its `/fr/...` twin).

---

## 1. Block styles

Click the **"Normal"** dropdown in the toolbar to change the current block's style. Each maps to a Portable Text block value defined in `blockContent.ts` (`normal`, `h1`–`h6`, `blockquote`). Sizing/spacing is the `prose` plugin's default scale — the renderer only adds a slug `id` + `scroll-mt-24` to H2/H3/H4 so the TOC can anchor.

| Studio style | Value        | When to use                                                                                                         |
| ------------ | ------------ | ------------------------------------------------------------------------------------------------------------------- |
| **Normal**   | `normal`     | Default body paragraph.                                                                                             |
| **H1**       | `h1`         | Reserved for the post title (auto-rendered by the layout). Don't use in the body — duplicate H1s break the outline. |
| **H2**       | `h2`         | Major sections. Gets an `id` — appears in the TOC.                                                                  |
| **H3**       | `h3`         | Sub-sections. Gets an `id` — appears in the TOC.                                                                    |
| **H4**       | `h4`         | Sub-sub-sections. Gets an `id` — appears in the TOC.                                                                |
| **H5**       | `h5`         | Editorial micro-headings. **Not** in the TOC (no `id`).                                                             |
| **H6**       | `h6`         | Metadata labels. **Not** in the TOC.                                                                                |
| **Citation** | `blockquote` | Long editorial pull quotes (left border + italic).                                                                  |

**TOC behaviour:** the right-rail sidebar auto-collects H2 / H3 / H4 with deterministic slug `id`s for click-to-scroll. Hide a section from the TOC by promoting it to H5 / H6.

---

## 2. Lists

Two list types, toggled with the bullet/number icons:

- **Puces** (bulleted) → `<ul>`, styled by the `prose` plugin.
- **Numéros** (numbered) → `<ol>`, styled by the `prose` plugin.

Lists nest — indent with **Tab** to push a level deeper. There is no checkbox or definition list; use a Custom HTML inline module for those.

---

## 3. Inline marks (decorators)

Select a span and click the toolbar icon, or use the shortcut.

| Mark         | Value            | Rendering                        | Shortcut    |
| ------------ | ---------------- | -------------------------------- | ----------- |
| **Gras**     | `strong`         | `<strong>`                       | ⌘B / Ctrl-B |
| **Italique** | `em`             | `<em>`                           | ⌘I / Ctrl-I |
| **Code**     | `code`           | `<code>` (monospace inline code) | —           |
| **Souligné** | `underline`      | `<u>`                            | ⌘U / Ctrl-U |
| **Barré**    | `strike-through` | `<s>`                            | —           |

Marks combine freely.

---

## 4. Links

The chain icon adds a **URL** annotation (`link`) around the selected text. It stores a single `href` — there's no internal/external toggle in the body editor. The renderer decides at display time:

- An `http(s)://` URL renders as `<a target="_blank" rel="noopener noreferrer">`.
- Anything else (e.g. a `/blog/another-post` path) renders as a plain `<a href="...">`.

The `link` mark lives in `portable-text-components.tsx` under `marks.link`.

> The internal/external union with a proper reference picker is a separate object (`link` / `cta`) used only by module CTAs — not by body-text links.

---

## 5. Inline images

The image icon drops a standalone image directly into the body. When you insert one:

1. **Upload** or pick an existing asset.
2. Set the **Alt** field for accessibility (leave blank for purely decorative images).
3. Drag the hotspot dot to mark the important region.

Live rendering: `next/image` at `width={1200} height={675}`, `aspect-[16/9]`, `rounded-xl`, `my-8`, `sizes="(min-width: 1024px) 768px, 100vw"`, `object-cover`. The GROQ projection (`MODULES_FRAGMENT`, `_type == "image"`) dereferences the asset URL (`asset->{ url }`) and coalesces `alt` to `""`.

For swipeable multi-image sets, use the [gallery module](./gallery.md) instead.

---

## 6. Inline modules (the "+" picker)

On an empty line, click **+** to insert a fancy block. Ten modules are inline-embeddable (the allowlist is `INLINE_MODULES` in `blockContent.ts`, mirrored by `INLINE_TYPES` in `portable-text-components.tsx`). The Studio shows French labels matching each schema title.

| Studio label          | Schema `_type`          | What it does                                                                                                      |
| --------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Accordéon**         | `module.accordion-list` | Expandable FAQ — `items[{title, content}]`. Each item's editor is the same block-content canvas.                  |
| **Encadré**           | `module.callout`        | 4 colour variants (info, success, warning, danger). Rich text + optional CTA.                                     |
| **Cartes**            | `module.card-list`      | Card grid (default 3 columns) with hairline dividers. Each card: title + content + optional image + optional CTA. |
| **Galerie d'images**  | `module.gallery`        | Swipeable carousel + thumbnails + click-to-zoom. See [gallery.md](./gallery.md).                                  |
| **Citations**         | `module.quote-list`     | Pull-quote stack referencing `quote` docs.                                                                        |
| **HTML personnalisé** | `module.custom-html`    | Escape hatch — raw HTML via `dangerouslySetInnerHTML`. Trust the source.                                          |
| **Infolettre**        | `module.newsletter`     | Email capture — card / inline / banner. Posts to `/api/newsletter`; see [newsletter](../newsletter/).             |
| **Personnes**         | `module.person-list`    | Centered avatar grid referencing `person` docs.                                                                   |
| **Statistiques**      | `module.stat-list`      | Key-number grid with hairline separators.                                                                         |
| **Étapes**            | `module.step-list`      | Vertical numbered timeline — each step title + content.                                                           |

**Not in the inline picker** (they only appear inside the blog singleton's `postModules` layout slot — page chrome, not body content):

- `module.blog-index` — blog-index hero
- `module.blog-post-content` — active-post slot (embedding it in a body would recurse)
- `module.blog-post-list` — post grid (featured/category filter, limit)
- `module.prose` — wraps a `blockContent` field; nesting prose inside prose adds nothing

---

## 7. Module-specific notes

### Callout (Encadré)

Default variant `info` (neutral muted background). The other three swap the palette (success → emerald, warning → amber, danger → destructive) with an identical layout. Optional CTA renders as a button at the bottom. Inner paragraphs have their `my-4` stripped (`[&_p]:my-0`) so the callout stays compact.

### Card list (Cartes)

The `columns` field controls cards-per-row on `lg+` (default 3). Hairline dividers use the same `bg-border + gap-px` pattern as Stats.

### Person list (Personnes)

Renders only `person` docs that have at least a `name`. The module's own title/intro are ignored at render — add a separate H2 or Prose block above it if you need a heading.

### Custom HTML (HTML personnalisé)

Rendered with `dangerouslySetInnerHTML` — whatever the editor writes lands in the DOM verbatim, `<script>` tags included. Treat access to this module as write access to the site; lock it down with Studio roles if needed. Use it for newsletter embeds, third-party widgets, tables, definition lists, or provider embed snippets.

### Legacy modules

Earlier template versions shipped Logo List and Hero Split modules; they were removed. If you're on an older dataset that still holds those instances, run `pnpm seed` once — `cleanupLegacy()` strips `module.hero-split` / `module.logo-list` from post bodies and `postModules` automatically.

---

## 8. What's _not_ available

Intentionally not shipped as a body primitive:

| Ask                          | Do this instead                                       |
| ---------------------------- | ----------------------------------------------------- |
| Tables                       | A Stat List or Card List, or Custom HTML.             |
| Footnotes / sidenotes        | An Accordion styled as "Notes", or inline italic.     |
| Embeds (YouTube / Tweet / …) | Paste the provider snippet into a Custom HTML module. |
| Definition lists             | Custom HTML or a Step List.                           |
| Inline buttons               | The optional CTA field on a Callout or Card.          |

Making any of these first-class means a new module — see [`blog-architecture.md`](./blog-architecture.md) § Adding a module.

---

## 9. Markdown export

Every post is also at `/<locale>/blog/<slug>/md` — YAML frontmatter + the body serialised to Markdown by `code/modules/web/blog/src/sanity/portable-to-markdown.ts`. The endpoint is advertised via `<link rel="alternate" type="text/markdown">` so RSS/llms.txt consumers can pick it up.

The serialiser handles paragraphs, `h1`–`h6`, blockquote, bullet/number lists, the `strong`/`em`/`code` marks, `link` annotations, and standalone images. **Inline modules are not serialised** — an unknown block is skipped and logged, not thrown, so the export never fails. Add a serialiser branch if a new module must appear in the export.
