import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AIIllustration2 } from "./ai-2";

const meta: Meta<typeof AIIllustration2> = {
  title: "UI Illustrations/Ai 2",
  component: AIIllustration2,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AIIllustration2>;
export const Default: Story = {};
