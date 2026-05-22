import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FuzzyText } from "./index";

const meta: Meta<typeof FuzzyText> = {
  title: "UI Effects/Text/FuzzyText",
  component: FuzzyText,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FuzzyText>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover>
        404
      </FuzzyText>
    </div>
  ),
};

export const ContinuousGlitch: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <FuzzyText
        baseIntensity={0.15}
        hoverIntensity={0.6}
        enableHover
        glitchMode
        glitchInterval={1500}
        glitchDuration={150}
      >
        SYSTEM
      </FuzzyText>
    </div>
  ),
};
