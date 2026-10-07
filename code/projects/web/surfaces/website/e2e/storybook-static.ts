/**
 * Locate the built Storybook that the visual e2e suite screenshots.
 *
 * @see docs/reference/projects/web/website/e2e/storybook-static.md
 */
import { join } from "node:path";

/** `code/projects/web/tools/storybook/storybook-static` — `storybook:build` writes it. */
export const STORYBOOK_STATIC = join(
  __dirname,
  "../../../tools/storybook/storybook-static",
);
