# @indiecrafts/packages-shared-ui-fonts

The self-hosted **font files** + their metadata, shared across surfaces (a design-system brick like
`ui-tokens`/`ui-icons`). Ships **Satoshi** (variable, upright + italic) under `fonts/`; Google-served
families (Geist) carry no file and stay loaded by the app.

- **Files:** `fonts/Satoshi-Variable.woff2` · `fonts/Satoshi-VariableItalic.woff2` · `fonts/Satoshi-LICENSE.txt`.
- **Registry:** `src/index.ts` — `FONT_FILES` (key → path + weight/style). `FontKey`/`FontRoles`
  **types** stay in `@indiecrafts/packages-shared-config`.

## Wiring

`next/font` needs static-literal loader calls, so the **web** app keeps its `localFont(...)` in
`src/lib/fonts.ts` and points `src.path` at this brick by relative path:

```ts
const satoshi = localFont({
  src: [{ path: "../../../../../../packages/shared/ui-fonts/fonts/Satoshi-Variable.woff2", weight: "300 900", style: "normal" }, …],
  variable: "--f-satoshi",
});
```

A **native** (Expo) app loads the same `.woff2` via `expo-font`. Add a font: drop the `.woff2` here,
add a `FONT_FILES` entry + a `FontKey` in config, then a `localFont` call in the app.
