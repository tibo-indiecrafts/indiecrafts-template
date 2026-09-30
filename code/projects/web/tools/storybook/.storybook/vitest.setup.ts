/**
 * Apply the gallery preview annotations to every story run as a component test.
 *
 * @see docs/reference/projects/web/tools/storybook/.storybook/vitest.setup.md
 */
import { setProjectAnnotations } from "@storybook/nextjs-vite";
import { beforeAll } from "vitest";
import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import * as preview from "./preview";

// Applies the a11y addon (runs axe after each story) + this Storybook's global
// decorators/parameters (theme wrapper, mocks) to every story run as a Vitest test.
// Without the addon annotations axe never runs, so a11y would pass vacuously.
const project = setProjectAnnotations([a11yAddonAnnotations, preview]);
beforeAll(project.beforeAll);
