import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import Legal from "./legal";

/**
 * Legal link-out screen (expo-router). `EXPO_PUBLIC_WEBSITE_URL` is bound to `""` in
 * this Storybook, so every button is disabled (no page to link out to) — this is the
 * screen's own built-in "not configured" behavior, not a mock gap.
 */
const meta = {
  title: "Mobile/Screens/Legal",
  component: Legal,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Legal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Legal" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Privacy policy" })).toBeDisabled();
  },
};
