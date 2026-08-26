import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { SkipLink } from "./SkipLink";

/**
 * First focusable element in `<body>` — off-screen until focused, then slides
 * into view. Exercises the next-intl mock (`common.skipToContent`).
 */
const meta = {
  title: "Website/Shared/SkipLink",
  component: SkipLink,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Present in the DOM (off-screen) even without focus. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Skip to content")).toBeInTheDocument();
  },
};
