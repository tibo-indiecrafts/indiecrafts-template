import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LightRays } from "./index";

const meta: Meta<typeof LightRays> = {
  title: "UI Effects/Backgrounds/LightRays",
  component: LightRays,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LightRays>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <LightRays
        raysOrigin="top-center"
        raysColor="#ffffff"
        raysSpeed={1}
        lightSpread={0.5}
        rayLength={3}
        followMouse
        mouseInfluence={0.1}
        noiseAmount={0}
        distortion={0}
        pulsating={false}
        fadeDistance={1}
        saturation={1}
      />
    </div>
  ),
};
