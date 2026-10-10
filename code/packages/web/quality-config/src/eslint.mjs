/**
 * The shared ESLint flat config of every Next web surface (website · admin · app).
 *
 * @see docs/reference/packages/web/quality-config/src/eslint.md
 */
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Next's core-web-vitals + TypeScript rules, with every `jsx-a11y` rule enumerated as an
 * error so a future `eslint-config-next` downgrade can't silently weaken accessibility
 * (WCAG 2.1 AA is the baseline), and routing forced through the app's `@/i18n/routing`
 * (locale prefixes, typed pathnames, hreflang). `src/i18n/routing.ts` is the one file allowed
 * to import `next-intl/navigation`. Build outputs are ignored; a surface adds its own
 * `ignores` (e.g. CLI-managed shadcn primitives).
 */
export function webEslintConfig({ ignores = [] } = {}) {
  return defineConfig([
    ...nextVitals,
    ...nextTs,
    {
      // Scope these overrides to the same glob where eslint-config-next's core-web-vitals
      // block registers the `jsx-a11y` + `@typescript-eslint` plugins these rules use. Without
      // a `files` key the object is global, so for a file outside those plugin globs ESLint sees
      // the rules but not the plugin → "could not find plugin jsx-a11y".
      files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
      rules: {
        // Structural a11y
        "jsx-a11y/alt-text": "error",
        "jsx-a11y/anchor-has-content": "error",
        "jsx-a11y/anchor-is-valid": "error",
        "jsx-a11y/heading-has-content": "error",
        "jsx-a11y/html-has-lang": "error",
        "jsx-a11y/iframe-has-title": "error",
        "jsx-a11y/img-redundant-alt": "error",
        "jsx-a11y/no-redundant-roles": "error",

        // ARIA correctness
        "jsx-a11y/aria-props": "error",
        "jsx-a11y/aria-proptypes": "error",
        "jsx-a11y/aria-role": "error",
        "jsx-a11y/aria-unsupported-elements": "error",
        "jsx-a11y/role-has-required-aria-props": "error",
        "jsx-a11y/role-supports-aria-props": "error",
        "jsx-a11y/scope": "error",

        // Interaction + keyboard
        "jsx-a11y/click-events-have-key-events": "error",
        "jsx-a11y/interactive-supports-focus": "error",
        "jsx-a11y/mouse-events-have-key-events": "error",
        "jsx-a11y/no-noninteractive-element-interactions": "error",
        "jsx-a11y/no-noninteractive-tabindex": "error",
        "jsx-a11y/no-static-element-interactions": "error",
        "jsx-a11y/tabindex-no-positive": "error",

        // Forms
        "jsx-a11y/label-has-associated-control": "error",
        "jsx-a11y/no-autofocus": "error",

        // Media
        "jsx-a11y/media-has-caption": "warn",

        // Legacy smells
        "jsx-a11y/no-access-key": "error",
        "jsx-a11y/no-distracting-elements": "error",
        "jsx-a11y/lang": "error",

        // Underscore-prefixed args/vars are intentional placeholders
        "@typescript-eslint/no-unused-vars": [
          "warn",
          { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],

        // A declaration-merging augmentation is an empty interface by design —
        // e.g. `interface CustomJwtSessionClaims extends AppSessionClaims {}` merges the
        // shared role shape onto Clerk's ambient claims. Allow the single-extends case
        // (a type alias can't declaration-merge), keeping the rule on for everything else.
        "@typescript-eslint/no-empty-object-type": [
          "error",
          { allowInterfaces: "with-single-extends" },
        ],

        // Routing: always go through @/i18n/routing so locale prefixes,
        // typed pathnames, and hreflang stay consistent. Direct imports
        // from next/link or next-intl/navigation bypass all of that.
        "no-restricted-imports": [
          "error",
          {
            paths: [
              {
                name: "next/link",
                message: "Use `Link` from `@/i18n/routing` instead.",
              },
              {
                name: "next-intl/navigation",
                message:
                  "Use `Link` / `redirect` / `usePathname` / `useRouter` / `getPathname` from `@/i18n/routing` instead — they're bound to the project's `routing` config.",
              },
            ],
          },
        ],
      },
    },
    {
      // The routing module is allowed (and required) to import from
      // next-intl/navigation — it's the single point where the typed
      // wrappers get created.
      files: ["src/i18n/routing.ts"],
      rules: { "no-restricted-imports": "off" },
    },
    globalIgnores([
      ".next/**",
      // Cloudflare / OpenNext + turbo build outputs — huge minified bundles; linting
      // them (they aren't dot-ignored by default) exhausts memory. Never hand-linted.
      ".open-next/**",
      ".wrangler/**",
      ".turbo/**",
      "dist/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // VitePress docs-site build output — generated, never hand-linted.
      "code/docs/.vitepress/dist/**",
      "code/docs/.vitepress/cache/**",
      ...ignores,
    ]),
  ]);
}
