import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DarkVeil } from "./index";

const meta: Meta<typeof DarkVeil> = {
  title: "UI Effects/Backgrounds/DarkVeil",
  component: DarkVeil,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof DarkVeil>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw">
      <DarkVeil />
    </div>
  ),
};

export const WithEffects: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw">
      <DarkVeil
        hueShift={45}
        noiseIntensity={0.08}
        scanlineIntensity={0.4}
        scanlineFrequency={2}
        warpAmount={0.5}
        speed={0.6}
      />
    </div>
  ),
};
