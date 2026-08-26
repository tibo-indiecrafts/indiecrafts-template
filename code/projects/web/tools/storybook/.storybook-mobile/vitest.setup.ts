import { setProjectAnnotations } from "@storybook/nextjs-vite";
import { beforeAll } from "vitest";
import * as preview from "./preview";

// Applies the mobile surface config's global decorators/parameters to every
// story when it runs as a Vitest component test.
const project = setProjectAnnotations([preview]);
beforeAll(project.beforeAll);
