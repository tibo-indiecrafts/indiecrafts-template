import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LiquidGradient } from "./index";

const meta: Meta<typeof LiquidGradient> = {
  title: "UI Effects/Backgrounds/LiquidGradient",
  component: LiquidGradient,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof LiquidGradient>;

export const Default: Story = {
  render: () => (
    <div className="relative h-[220px] w-[640px] overflow-hidden rounded-[140px]">
      <LiquidGradient />
    </div>
  ),
};
