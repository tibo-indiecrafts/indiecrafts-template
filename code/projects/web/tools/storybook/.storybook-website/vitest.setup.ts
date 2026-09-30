/**
 * Apply the website-surface preview annotations to every story run as a component test.
 *
 * @see docs/reference/projects/web/tools/storybook/.storybook-website/vitest.setup.md
 */
import { setProjectAnnotations } from "@storybook/nextjs-vite";
import { beforeAll } from "vitest";
import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import * as preview from "./preview";

// Applies the a11y addon (axe after each story — without it a11y passes vacuously) + the
// website surface config's global decorators/parameters to every story run as a test.
const project = setProjectAnnotations([a11yAddonAnnotations, preview]);
beforeAll(project.beforeAll);
