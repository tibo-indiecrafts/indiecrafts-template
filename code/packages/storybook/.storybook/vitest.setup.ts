import { setProjectAnnotations } from "@storybook/nextjs-vite";
import { beforeAll } from "vitest";
import * as preview from "./preview";

// Applies this Storybook's global decorators/parameters (theme wrapper, mocks)
// to every story when it runs as a Vitest component test.
const project = setProjectAnnotations([preview]);
beforeAll(project.beforeAll);
