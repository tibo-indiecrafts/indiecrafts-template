import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * ESLint flat config — production app.
 *
 * Enumerates `jsx-a11y` rules explicitly so a future `eslint-config-next`
 * downgrade can't silently weaken accessibility coverage. WCAG 2.1 AA is
 * the baseline; treat every jsx-a11y violation as an error.
 *
 * Mirrors the rule set in `../component-library/eslint.config.mjs` so
 * both repos enforce the same a11y bar. The library loosens
 * `anchor-is-valid` + `no-static-element-interactions` on its /components
 * examples surface; /app keeps the strict defaults everywhere.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
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
    "out/**",
    "build/**",
    "next-env.d.ts",
    // VitePress docs-site build output — generated, never hand-linted.
    "code/docs/.vitepress/dist/**",
    "code/docs/.vitepress/cache/**",
  ]),
]);

export default eslintConfig;
