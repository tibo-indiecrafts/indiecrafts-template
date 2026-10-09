import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { NavIcon } from "./NavIcon";

/**
 * The glyph an editor picked for a header link (the `navigation` doc's `icon`, from the
 * curated `GLYPHS` list). Unknown or empty names render nothing. Decorative.
 */
const meta = {
  title: "Components/NavIcon",
  component: NavIcon,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { name: "rocket" },
} satisfies Meta<typeof NavIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A curated glyph name. */
export const Named: Story = {
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('[aria-hidden="true"]');
    await expect(icon?.querySelector("svg")).toBeInTheDocument();
  },
};

/** A larger glyph (the header dropdown's rich links use 18). */
export const Large: Story = {
  args: { size: 24 },
};

/** A name outside the curated list → nothing. */
export const Unknown: Story = {
  args: { name: "not-a-glyph" },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("svg")).toBeNull();
  },
};
