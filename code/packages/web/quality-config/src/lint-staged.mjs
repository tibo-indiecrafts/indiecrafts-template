/**
 * The shared commit-time checks of every Next web surface (website · admin · app).
 *
 * @see docs/reference/packages/web/quality-config/src/lint-staged.md
 */

/** Staged code is fixed by ESLint then formatted; staged data and docs are formatted. */
const config = {
  "*.{ts,tsx,js,jsx,mjs,cjs}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"],
};

export default config;
