import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { MorphiconsShowcase } from "./MorphiconsShowcase";

/**
 * Homepage Morphicons demo — icons that morph between two related shapes on
 * click. Exercises the next-intl mock under the real namespace the home page
 * passes (`pages.home.blocks.morphicons`).
 */
const meta = {
  title: "Website/Homepage/MorphiconsShowcase",
  component: MorphiconsShowcase,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { id: "home-morphicons", namespace: "pages.home.blocks.morphicons" },
} satisfies Meta<typeof MorphiconsShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Icons that morph, not swap")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Menu / close" })).toBeVisible();
  },
};

/** Behavior: clicking a tile toggles its morph state. */
export const TogglesOnClick: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tile = canvas.getByRole("button", { name: "Menu / close" });
    await expect(tile).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(tile);
    await expect(tile).toHaveAttribute("aria-pressed", "true");
  },
};
