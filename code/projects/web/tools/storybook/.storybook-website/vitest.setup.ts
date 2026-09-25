/**
 * Apply the website-surface preview annotations to every story run as a component test.
 *
 * @see docs/reference/projects/web/tools/storybook/.storybook-website/vitest.setup.md
 */
import { setProjectAnnotations } from "@storybook/nextjs-vite";
import { beforeAll } from "vitest";
import * as preview from "./preview";

// Applies the website surface config's global decorators/parameters to every
// story when it runs as a Vitest component test.
const project = setProjectAnnotations([preview]);
beforeAll(project.beforeAll);
