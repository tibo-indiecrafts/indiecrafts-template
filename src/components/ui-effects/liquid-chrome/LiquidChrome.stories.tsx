import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LiquidChrome } from "./index";

const meta: Meta<typeof LiquidChrome> = {
  title: "UI Effects/Backgrounds/LiquidChrome",
  component: LiquidChrome,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LiquidChrome>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw overflow-hidden bg-black">
      <LiquidChrome baseColor={[0.1, 0.1, 0.1]} speed={0.3} amplitude={0.3} interactive />
    </div>
  ),
};
