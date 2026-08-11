# Sanity legends — field labels for non-technical editors

Load when adding or editing any Sanity schema field (`defineField`). "Legend" =
the `title` + `description` an editor reads in the Studio. The reader is the
**client / content editor**, not a developer. Write for them.

## Rules

- **Titles: plain words, no acronyms or code.** Not `schema.org`, `JSON-LD`, `OG`,
  `noindex`, `pageId`, `LocalBusiness`, `slug`. Say what the editor sees:
  "Type d'activité", "Image de partage", "Masquer des moteurs de recherche".
- **Description = what it is + what it changes + an example.** One or two short
  sentences. Name the visible effect ("apparaît dans l'onglet du navigateur et sur
  Google"), not the mechanism ("émet une balise `<title>`").
- **Say what "empty" does** for every optional field: "Vide = image par défaut",
  "Vide = masqué".
- **French, plain register.** Match the existing Studio copy. Short: aim ≤ 160
  characters. No jargon, no idioms.
- **Give a concrete example** when a format matters: "Ex. « 1200 »",
  "Séparés par des virgules", "Format 1200×630".
- **Keep the field `name` unchanged** — it is the code key wired to GROQ/queries.
  Only `title` + `description` are the legend. Never rename `name` to fix a legend.
- **If a technical term is unavoidable** (canonical, RGPD), keep the word but
  explain it in plain language right after, and tell the editor when to leave it
  alone ("laissez vide sauf doublon").
- **Match the field's real effect.** If the legend and the code disagree, the
  legend is wrong — fix the words, not the behaviour.

## Why

A field a non-technical editor can't understand is a field they won't touch (or
will misuse). The legend is the whole UI for that person. This rule is the
`writing-style` rule (see [`writing-style`](./writing-style.md)) applied to Studio
copy — except the audience is the editor, so warmth + concreteness beat brevity.
