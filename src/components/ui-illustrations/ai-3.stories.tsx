import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AIIllustration3 } from "./ai-3";

const meta: Meta<typeof AIIllustration3> = {
  title: "UI Illustrations/Ai 3",
  component: AIIllustration3,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AIIllustration3>;
export const Default: Story = {};
