import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CodeSnippet from "./code-snippet";

const meta: Meta<typeof CodeSnippet> = {
  title: "UI Illustrations/Code Snippet",
  component: CodeSnippet,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CodeSnippet>;
export const Default: Story = {};
