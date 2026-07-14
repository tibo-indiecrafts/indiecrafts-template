# Body editor reference

Everything you can insert into a post body in the Studio.

The body editor is Sanity's Portable Text canvas, configured by `src/features/blog/sanity/schema/blockContent.ts`. On the live site, the same configuration is rendered by `src/features/blog/components/modules/portable-text-components.tsx` — every primitive listed here has explicit Tailwind styling there (no `@tailwindcss/typography` dependency).

If you want to _see_ every primitive in one post, look at the showcase article: `/en/blog/fast-prototyping-with-nextjs` (or `/fr/...prototypage-rapide-avec-nextjs`). The seed scaffolds it on purpose.

---

## 1. Block styles

Click the **"Normal"** dropdown at the top of the body editor toolbar to switch the style of the current block.

| Style                     | Live rendering                                                                                  | When to use                                                                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Normal**                | Body paragraph, `text-base leading-7`, `my-4` margin                                            | Default for prose                                                                                                           |
| **H1**                    | Largest heading, `text-4xl md:text-5xl font-bold`, `tracking-tight`, `mt-10 mb-4`               | Reserved for the post title (auto-rendered by the layout). Don't use H1 in the body — duplicate H1s break the page outline. |
| **H2**                    | `text-3xl md:text-4xl font-bold tracking-tight`, `mt-10 mb-4`. Picked up by the TOC sidebar.    | Major sections inside the post                                                                                              |
| **H3**                    | `text-2xl md:text-3xl font-semibold tracking-tight`, `mt-8 mb-3`. Picked up by the TOC sidebar. | Sub-sections under H2                                                                                                       |
| **H4**                    | `text-xl md:text-2xl font-semibold`, `mt-6 mb-2`. Picked up by the TOC sidebar.                 | Sub-sub-sections; rarely needed in editorial                                                                                |
| **H5**                    | `text-base font-semibold tracking-tight`, `mt-6 mb-2`. NOT in the TOC.                          | Editorial micro-headings ("Editor's note", etc.)                                                                            |
| **H6**                    | `text-sm font-semibold uppercase tracking-wide`, `text-muted-foreground`. NOT in the TOC.       | Metadata labels ("Updated", "Source", "Disclosure")                                                                         |
| **Citation** (Blockquote) | `text-lg italic`, left border (`border-l-4 border-foreground/30 pl-4`), `text-muted-foreground` | Long editorial pull quotes                                                                                                  |

**TOC behaviour:** the right-rail sidebar on every post auto-collects H2 / H3 / H4 with deterministic `id` slugs so the entries are click-to-scroll-to-section. Hide a section from the TOC by promoting it to H5 / H6 instead.

---

## 2. Lists

Two list types, toggled with the bullet/number icons in the toolbar.

- **Puces** (bulleted) — `<ul>` with `list-disc ml-6 my-4 space-y-2 marker:text-muted-foreground`
- **Numéros** (numbered) — `<ol>` with `list-decimal ml-6 my-4 space-y-2 marker:text-muted-foreground`

Both render with relaxed `leading-7` per item.

Lists nest naturally — indent with **Tab** to push one level deeper. There is no separate "checkbox" or "definition list" — for those, use a Custom HTML inline module.

---

## 3. Inline marks (decorators)

Select a span of text and click the toolbar icon, or use the keyboard shortcuts.

| Mark                       | Rendering                                                                                       | Shortcut      |
| -------------------------- | ----------------------------------------------------------------------------------------------- | ------------- |
| **Gras** (strong)          | `<strong>`                                                                                      | ⌘B / Ctrl-B   |
| **Italique** (em)          | `<em>`                                                                                          | ⌘I / Ctrl-I   |
| **Code**                   | `<code className="bg-muted rounded px-1.5 py-0.5 font-mono text-[0.85em]">` — looks like a pill | (no shortcut) |
| **Souligné** (underline)   | `<u>`                                                                                           | ⌘U / Ctrl-U   |
| **Barré** (strike-through) | `<s>`                                                                                           | (no shortcut) |

Marks combine freely — you can have "**important `code`**" with both `strong` + `code`.

---

## 4. Links

The chain icon adds a link annotation around the selected text.

- Internal links: paste a path starting with `/` (e.g. `/blog/another-post`). Rendered as `<a href="...">`.
- External links: paste any `http(s)://` URL. Rendered as `<a target="_blank" rel="noopener noreferrer">`.

The renderer is in `src/features/blog/components/modules/portable-text-components.tsx` under `marks.link`.

---

## 5. Inline images

The image icon in the toolbar lets you drop a standalone image directly into the body.

When you insert one:

1. Click **Upload** or pick an existing asset from the library
2. (Optional) Set the `Alt` field for accessibility — leave blank for purely decorative images
3. Drag the hotspot dot to mark the "important" part of the image (used when the page crops to 16:9)

Live rendering: `next/image` with `width={1200} height={675} sizes="(min-width: 1024px) 768px, 100vw"`, aspect-`16/9`, rounded corners, `my-8` vertical margin. The GROQ projection (`MODULES_FRAGMENT` in `src/features/blog/sanity/queries.ts`) auto-dereferences the asset URL (`asset->{ url }`).

Images are best used to break up long stretches of prose. For decorative spacing or fancy galleries, use a Custom HTML inline module instead.

---

## 6. Inline modules (the "+" picker)

Inside any empty line, click the **+** button to insert one of 8 fancy blocks. The Sanity Studio shows them in a popover with French labels matching their schema title.

| Studio label          | Schema `_type`          | What it does                                                                                                                             |
| --------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Accordéon**         | `module.accordion-list` | Expandable FAQ — `items[{title, content}]`. The body editor inside each item is the same as the outer one.                               |
| **Encadré**           | `module.callout`        | 4 colour variants (info, success, warning, danger). Holds rich text + optional CTA.                                                      |
| **Cartes**            | `module.card-list`      | 3-column grid (1 / 2 / 4 also possible) with hairline-divider separators. Each card has title + content + optional image + optional CTA. |
| **Citations**         | `module.quote-list`     | Pull-quote stack — references one or more `quote` docs. Locale-filtered (an EN post can only embed EN quotes).                           |
| **HTML personnalisé** | `module.custom-html`    | Escape hatch — raw HTML rendered with `dangerouslySetInnerHTML`. Trust the source.                                                       |
| **Personnes**         | `module.person-list`    | Centered avatar grid (2 / 3 columns) referencing `person` docs.                                                                          |
| **Statistiques**      | `module.stat-list`      | Key-number grid (4 cells by default) with hairline separators.                                                                           |
| **Étapes**            | `module.step-list`      | Vertical numbered timeline. Each step has title + content.                                                                               |

**Excluded from the inline picker** (you'll only see them inside `blog.postModules`):

- `Fil d'ariane` (Breadcrumbs)
- `Hero du blog` (Blog index hero)
- `Contenu d'article` (Active-post slot)
- `Articles` (Blog post list — featured filter, category filter, limit)
- `Recherche` (Client-side post search)
- `Prose` (Wraps a `blockContent` field; embedding inside another body would be circular)

These are page-chrome modules — they belong in the layout shell, not interleaved with paragraph copy.

---

## 7. Module-specific notes

### Callout (Encadré)

The default variant is `info` (neutral muted background). The other three swap the colour palette (success → emerald, warning → amber, danger → destructive red) but the layout is identical. Optional CTA renders as a button at the bottom of the callout.

Inner paragraphs inside a callout have their default `my-4` margin stripped (`[&_p]:my-0`) so the callout stays compact regardless of how the editor formats the content.

### Card list (Cartes)

The `columns` field controls how many cards per row on `lg+`: defaults to 3. Hairline dividers come from the same `bg-border + gap-px` pattern as Stats — both visuals are aligned by design.

### Person list (Personnes)

Renders only when the referenced `person` docs have at least a `name`. The title/intro on the module itself are intentionally ignored at render time — the layout assumes a tight grid without a section header. Add a separate H2 or Prose block above the module if you need a heading.

### Quote list (Citations) + Logo list / Hero split (removed)

Earlier template versions shipped Logo List, Hero Split, and Form modules. They were removed in the 2026-05 editorial overhaul. If you're working against an older dataset that still contains those module instances, run `pnpm seed:blog` once — the seed's `cleanupLegacy()` step will strip them automatically.

### Custom HTML

Renders inside a `<section className="w-full py-8 md:py-12">` with `dangerouslySetInnerHTML`. Whatever HTML the editor writes lands in the DOM verbatim — including `<script>` tags. Treat editor access to this module as equivalent to write access on the site itself: lock down with Studio roles if you need to restrict it.

The seeded example HTML is a centred muted-background pill explaining the module — use that as a template for newsletter embeds, partner badges, third-party widgets, etc.

---

## 8. What's _not_ available

Things editors sometimes ask for that this template intentionally doesn't ship as a body primitive:

- **Tables** — Sanity supports them via plugins, but most editorial use cases are better served by a Stat List or a Card List. If you really need a table, drop one in via Custom HTML.
- **Footnotes / sidenotes** — not built in. Use an Accordion module styled as a "Notes" block, or write them inline in italic.
- **Embeds (YouTube / Tweet / etc.)** — not built in. Drop the provider's embed snippet into a Custom HTML module.
- **Definition lists** — same answer: Custom HTML or a Step List.
- **Inline buttons** — not as a body primitive. Use the optional CTA field on a Callout or Card.

Adding any of these as first-class primitives means a new module — see [`blog-architecture.md`](./blog-architecture.md) § Adding a module.

---

## 9. Markdown export

Every post is also reachable at `/<locale>/blog/<slug>/md` — YAML frontmatter + the body serialised to Markdown. The serialiser lives at `src/features/blog/sanity/portable-to-markdown.ts` and handles every primitive listed above.

The endpoint is advertised on the post page itself via `<link rel="alternate" type="text/markdown">` so RSS readers, llms.txt consumers, and other clients can pick it up automatically.
