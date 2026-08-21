# Accessibility rules — native (Expo / React Native)

Load when building or reviewing any mobile UI. The RN mirror of the web
[`accessibility`](../../../../web/surfaces/website/.claude/rules/accessibility.md) rule — same intent,
platform-native APIs (there is no DOM/ARIA; RN maps `accessibility*` props to VoiceOver / TalkBack).

**Structural (screen readers)**

- Every touchable has a **role + name**: `accessibilityRole="button"` (or link/switch/…) +
  `accessibilityLabel`. Icon-only controls MUST carry an `accessibilityLabel` (no visible text to infer).
- Headings use `accessibilityRole="header"` so VoiceOver/TalkBack announce them + enable heading
  navigation. `ThemedText variant="title"` does this automatically.
- Signal disabled/selected state to AT: `accessibilityState={{ disabled }}` / `{{ selected }}` — never by
  color/opacity alone.
- Add `accessibilityHint` only when the action's result is not obvious from the label.
- Group a composite control with `accessible={true}` on the wrapper; keep a content card a transparent
  container (its children stay individually focusable).

**Touch + type**

- Touch targets **≥ 44×44 pt** (`Button` is 44 tall). For a small glyph, pad or add `hitSlop`.
- **Dynamic type** — leave RN's default `allowFontScaling` **on** (never disable it); verify the layout
  holds when the OS font size is cranked up (a `title` must not clip).

**Color + contrast**

- Colors come from the shared tokens (`ui-tokens/native`, generated from the same OKLCH source the web
  `pnpm verify:contrast` gate checks) — so contrast is governed at the token layer. Never hard-code a
  color to "fix" contrast in a component.

**Verify**

- Run a **VoiceOver (iOS) / TalkBack (Android)** pass on any new screen: every control announces a role +
  name, focus order is logical, nothing is unreachable. A screen that renders is not a screen a
  screen-reader user can use.
