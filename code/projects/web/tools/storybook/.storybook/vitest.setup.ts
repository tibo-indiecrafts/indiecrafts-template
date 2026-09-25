/**
 * Apply the gallery preview annotations to every story run as a component test.
 *
 * @see docs/reference/projects/web/tools/storybook/.storybook/vitest.setup.md
 */
import { setProjectAnnotations } from "@storybook/nextjs-vite";
import { beforeAll } from "vitest";
import * as preview from "./preview";

// Applies this Storybook's global decorators/parameters (theme wrapper, mocks)
// to every story when it runs as a Vitest component test.
const project = setProjectAnnotations([preview]);
beforeAll(project.beforeAll);
