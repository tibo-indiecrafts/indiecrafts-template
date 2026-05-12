import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AIIllustration1 } from "./ai-1";

const meta: Meta<typeof AIIllustration1> = {
  title: "UI Illustrations/Ai 1",
  component: AIIllustration1,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AIIllustration1>;
export const Default: Story = {};
