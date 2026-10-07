import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { SkipLink } from "./SkipLink";
import docs from "./SkipLink.md?raw";

const meta = {
  title: "UI Components/SkipLink",
  component: SkipLink,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: { description: { component: docs } },
  },
  args: { label: "Skip to content" },
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The first Tab focuses the link and slides it into view. */
export const Focused: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", {
      name: "Skip to content",
    });
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await expect(link).toHaveAttribute("href", "#main");
  },
};
