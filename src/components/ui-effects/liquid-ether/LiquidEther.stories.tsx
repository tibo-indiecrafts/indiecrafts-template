import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LiquidEther } from "./index";

const meta: Meta<typeof LiquidEther> = {
  title: "UI Effects/Backgrounds/LiquidEther",
  component: LiquidEther,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LiquidEther>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <LiquidEther
        colors={["#5227FF", "#FF9FFC", "#B497CF"]}
        mouseForce={20}
        cursorSize={100}
        isViscous
        viscous={30}
        iterationsViscous={32}
        iterationsPoisson={32}
        resolution={0.5}
        isBounce={false}
        autoDemo
        autoSpeed={0.5}
        autoIntensity={2.2}
        takeoverDuration={0.25}
        autoResumeDelay={3000}
        autoRampDuration={0.6}
      />
    </div>
  ),
};
