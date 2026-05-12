import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CodeBlockIllustration from "./code-block-illustration";

const meta: Meta<typeof CodeBlockIllustration> = {
  title: "UI Illustrations/CodeBlock",
  component: CodeBlockIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CodeBlockIllustration>;

export const Default: Story = {};
