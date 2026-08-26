import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { IconShowcase } from "./IconShowcase";

/**
 * Homepage icon-systems showcase (Lucide / Reicon / brand marks). Exercises
 * the next-intl mock under the real namespace the home page passes
 * (`pages.home.blocks.icons`).
 */
const meta = {
  title: "Website/Homepage/IconShowcase",
  component: IconShowcase,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { id: "home-icons", namespace: "pages.home.blocks.icons" },
} satisfies Meta<typeof IconShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("One interface, three icon sets")).toBeVisible();
    await expect(canvas.getByText("Lucide — UI glyphs")).toBeVisible();
    await expect(canvas.getByText("Reicon Brands — official colors")).toBeVisible();
  },
};
