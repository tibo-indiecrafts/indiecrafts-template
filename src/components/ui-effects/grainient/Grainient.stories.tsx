import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Grainient } from "./index";

const meta: Meta<typeof Grainient> = {
  title: "UI Effects/Backgrounds/Grainient",
  component: Grainient,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Grainient>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <Grainient
        color1="#FF9FFC"
        color2="#5227FF"
        color3="#B497CF"
        timeSpeed={0.25}
        colorBalance={0}
        warpStrength={1}
        warpFrequency={5}
        warpSpeed={2}
        warpAmplitude={50}
        blendAngle={0}
        blendSoftness={0.05}
        rotationAmount={500}
        noiseScale={2}
        grainAmount={0.1}
        grainScale={2}
        grainAnimated={false}
        contrast={1.5}
        gamma={1}
        saturation={1}
        centerX={0}
        centerY={0}
        zoom={0.9}
      />
    </div>
  ),
};
