import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Waves } from "./index";

const meta: Meta<typeof Waves> = {
  title: "UI Effects/Backgrounds/Waves",
  component: Waves,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Waves>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <Waves
        lineColor="#ffffff"
        backgroundColor="rgba(255, 255, 255, 0.2)"
        waveSpeedX={0.0125}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />
    </div>
  ),
};
