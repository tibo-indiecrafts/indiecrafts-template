import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ThemeProvider } from "./ThemeProvider";

/**
 * Thin client wrapper around `next-themes`. Real (unmocked) `next-themes` —
 * it's a plain client provider, safe to mount as-is. Proof story: renders its
 * children, no server-resolved props needed for the "system" default.
 */
const meta = {
  title: "Website/Shared/ThemeProvider",
  component: ThemeProvider,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    attribute: "data-theme",
    defaultTheme: "system",
    children: <p>Themed content</p>,
  },
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Themed content")).toBeVisible();
  },
};
