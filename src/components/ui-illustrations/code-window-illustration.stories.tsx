import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeWindowIllustration } from "./code-window-illustration";

const meta: Meta<typeof CodeWindowIllustration> = {
  title: "UI Illustrations/CodeWindowIllustration",
  component: CodeWindowIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CodeWindowIllustration>;

export const Default: Story = {};
