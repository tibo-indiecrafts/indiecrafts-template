# `@indiecrafts/packages-shared-utils` — pure helpers

The leaf brick: small, dependency-light functions, no React/Next runtime.

|               |                                                                                                                                                                                                                                                                                                                                                 |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exports**   | Subpath-only (no `.` barrel): `./cn` · `./slugify` · `./video-embed` · `./format-date` · `./error-message` · `./filename` · `./form`. Import one helper per path — `import { cn } from "@indiecrafts/packages-shared-utils/cn"`. `./form` holds the shared public-form primitives (`isSpam` honeypot/too-fast · `isValidEmail` · `tooFast` · `cleanList`), used by the newsletter/waitlist/contact modules so the anti-spam heuristic is tuned in one place. (Logging moved to its own brick — [`@indiecrafts/packages-shared-logger`](./logger); text truncation lives in [`@indiecrafts/packages-shared-format`](./format) `/text`.) |
| **Deps**      | `@indiecrafts/packages-shared-config` (for `Locale` in `format-date`), `clsx`, `tailwind-merge`                                                                                                                                                                                                                                                                 |
| **Consumers** | app + blog + `ui` (for `cn`) + `ui-components` + newsletter · waitlist · contact (for `./form`)                                                                                                                                                                                                                                                  |

- **Gotcha:** barrel-less like every brick. The `exports` map is
  explicit-extension (`"./cn": "./src/cn.ts"`, sanity-style), so every consumer resolves
  a subpath with no tsconfig `paths` entry. Add a helper file → add its `exports` line.
- **Gotcha:** `format-date` exports `formatDate(locale, iso?, { month })` — a generic date
  formatter (renamed from `formatPostDate`; it is not blog-specific).
- **`./error-message`** — `getErrorMessage(e: unknown): string`. Reads a Zod-style `issues[]`
  (joined) → `Error.message` → `String(e)`. **Duck-types Zod** so `utils` keeps no `zod` dep.
- **`./filename`** — `sanitizeAndCropFilename(name, maxLength?)` + `validateFilenameLength(name)`.
  Strips the path + unsafe chars, preserves the extension, and crops by **UTF-8 byte length**
  (binary search) so a multi-byte char is never split — for upload / asset filenames.

## Wiring & conventions

How every brick is consumed (exports · `transpilePackages` · resolution · Tailwind `@source`
· hardening), the ≥2-consumer rule → **[Packages overview](./)**.

- [`code/packages/shared/utils/`](../../code/packages/shared/utils/) — the source
- [`code/packages/_registry.md`](../../code/packages/_registry.md) — roster + rule
