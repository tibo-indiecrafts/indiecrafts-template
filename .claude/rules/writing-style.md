---
description: How the agent writes its own output — docs, comments, commit messages (STE-informed). Not UI copy.
---

# Writing style — agent output

How the AI agent writes **its own output**: explanations, generated docs, code comments, commit and PR messages, changelog entries. Informed by ASD-STE100 Simplified Technical English — clear and easy to translate.

**Scope:** text the agent produces. **Not** UI-facing product copy — that lives in `messages/<locale>.json`, follows `DESIGN.md` Product Content, and stays warm and editorial for marketing.

## Rules

- Active voice.
- One idea per sentence; ≤ 20 words.
- Simple tenses: present, past, future.
- Same word for the same idea every time — do not vary for style.
- No idioms, slang, or jargon.
- Paragraphs ≤ 6 sentences.
- **Keep technical items exact** — file paths, function names, config keys, prices, and numbers never change (`workers/updatePricing.php`, `$4,855`).
- Lead with the answer, then the reason.
- **Be concise** — cut filler, hedging, and restated context. If the explanation is longer than the thing it explains, delete the explanation.

Applies to docs, comments, and commits regardless of chat reply mode.
