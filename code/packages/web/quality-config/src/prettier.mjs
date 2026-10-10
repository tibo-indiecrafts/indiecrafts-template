/**
 * The shared Prettier config of every Next web surface (website · admin · app).
 *
 * @see docs/reference/packages/web/quality-config/src/prettier.md
 */

import * as tailwind from "prettier-plugin-tailwindcss";

/** Double quotes, semicolons, trailing commas, 90 columns, Tailwind classes sorted. The plugin is
 *  imported here (not named), so it resolves from this brick, not from each surface. */
/** @type {import('prettier').Config} */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 90,
  plugins: [tailwind],
};

export default config;
