/**
 * Apply the gallery preview annotations in the Dark theme, so every story also runs as a
 * component + a11y test in dark mode (contrast differs per theme).
 *
 * @see docs/reference/projects/web/tools/storybook/.storybook/vitest.setup.dark.md
 */
import { setProjectAnnotations } from "@storybook/nextjs-vite";
import { beforeAll } from "vitest";
import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import * as preview from "./preview";

// The toolbar's theme decorator doesn't set `data-theme` in the test runner, so set it
// here — `[data-theme="dark"]` is exactly what the token system keys on.
const dark = {
  decorators: [
    (Story: () => unknown) => {
      document.documentElement.dataset.theme = "dark";
      return Story();
    },
  ],
};

const project = setProjectAnnotations([a11yAddonAnnotations, preview, dark]);
beforeAll(project.beforeAll);
