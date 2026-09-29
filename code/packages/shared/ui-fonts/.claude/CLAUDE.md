# @indiecrafts/packages-shared-ui-fonts — self-hosted font files

Auto-loads under `code/packages/shared/ui-fonts/**`. The self-hosted `.woff2` font files plus a
`FONT_FILES` metadata registry, centralized so every surface ships from one place (a design-system
brick like `ui-tokens`). Consumed by the website (`next/font` `localFont`). Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** TypeScript + `.woff2` files (no runtime deps).

- **Exports:** `.` → `FONT_FILES` (`FontKey` → path + weight/style) + the `FontFile` type.
- **Files move here, the loader stays in the app** — `next/font` needs static-literal `localFont`
  calls, so the app points `src.path` at `../fonts/*.woff2` by relative path, never a JS import.
- **`FontKey` / `FontRoles` types live in `packages-shared-config`** — this brick owns only the files.
- **Add a font:** drop the `.woff2` here, add a `FONT_FILES` entry + a `FontKey` in config, then a
  `localFont` call in the app. Google-served families (Geist) carry no file — the app loads them.

Full reference → [`code/docs/packages/ui-fonts.md`](../../../../docs/packages/ui-fonts.md).
