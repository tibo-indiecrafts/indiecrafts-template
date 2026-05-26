import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Antigravity } from "./index";

const meta: Meta<typeof Antigravity> = {
  title: "UI Effects/Animations/Antigravity",
  component: Antigravity,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Antigravity>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <div className="relative h-[400px] w-full">
        <Antigravity
          count={300}
          magnetRadius={6}
          ringRadius={7}
          waveSpeed={0.4}
          waveAmplitude={1}
          particleSize={1.5}
          lerpSpeed={0.05}
          color="#5227FF"
          autoAnimate
          particleVariance={1}
          rotationSpeed={0}
          depthFactor={1}
          pulseSpeed={3}
          particleShape="capsule"
          fieldStrength={10}
        />
      </div>
    </div>
  ),
};

export const Spheres: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <div className="relative h-[600px] w-full">
        <Antigravity
          count={500}
          magnetRadius={8}
          ringRadius={6}
          waveSpeed={0.6}
          waveAmplitude={1.5}
          particleSize={1.2}
          lerpSpeed={0.08}
          color="#FF9FFC"
          autoAnimate
          rotationSpeed={0.3}
          particleShape="sphere"
        />
      </div>
    </div>
  ),
};
