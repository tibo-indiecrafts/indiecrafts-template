> `module.prose` renderer · `renderers/Prose.tsx`

**Use when** a block holds long-form editorial body copy (paragraphs, headings, lists, links) authored as PortableText and rendered at a readable measure.

## Props

| Prop         | Type                     | Default    | Notes                                                 |
| ------------ | ------------------------ | ---------- | ----------------------------------------------------- |
| `content`    | `PortableTextBlock[]`    | —          | The body. Renders `null` when empty.                  |
| `width`      | `"narrow" \| "wide"`     | `"narrow"` | `narrow` → `max-w-2xl`; `wide` → `max-w-5xl`.         |
| `components` | `PortableTextComponents` | —          | **Required.** The serializer map for each block/mark. |
| `anchor`     | `string`                 | —          | Sets the section `id` for in-page links.              |

## Notes

- Server component — no client JS, no state.
- `components` is required; the renderer passes it straight to `<PortableText>`, so custom marks/blocks (code, callouts, links) will not render without it.
- Wraps content in `prose prose-neutral dark:prose-invert` — the Tailwind typography plugin styles the body and adapts to light/dark.
- Centered with page gutters (`px-(--gutter)`) and vertical rhythm (`py-10 md:py-16`).
