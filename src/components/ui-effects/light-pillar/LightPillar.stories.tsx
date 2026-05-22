import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LightPillar } from "./index";

const meta: Meta<typeof LightPillar> = {
  title: "UI Effects/Backgrounds/LightPillar",
  component: LightPillar,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LightPillar>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <LightPillar
        topColor="#5227FF"
        bottomColor="#FF9FFC"
        intensity={1}
        rotationSpeed={0.3}
        glowAmount={0.002}
        pillarWidth={3}
        pillarHeight={0.4}
        noiseIntensity={0.5}
        pillarRotation={25}
        interactive={false}
        mixBlendMode="screen"
        quality="high"
      />
    </div>
  ),
};
