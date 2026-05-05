import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CodeBookmarks from "./CodeBookmarks";

const meta: Meta<typeof CodeBookmarks> = {
  title: "UI Molecules/Code/CodeBookmarks",
  component: CodeBookmarks,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CodeBookmarks>;

export const Default: Story = {};
