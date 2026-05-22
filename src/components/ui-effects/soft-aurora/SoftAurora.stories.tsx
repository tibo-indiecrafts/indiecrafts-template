import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SoftAurora } from "./index";

const meta: Meta<typeof SoftAurora> = {
  title: "UI Effects/Backgrounds/SoftAurora",
  component: SoftAurora,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof SoftAurora>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <SoftAurora
        speed={0.6}
        scale={1.5}
        brightness={1}
        color1="#f7f7f7"
        color2="#e100ff"
        noiseFrequency={2.5}
        noiseAmplitude={1}
        bandHeight={0.5}
        bandSpread={1}
        octaveDecay={0.1}
        layerOffset={0}
        colorSpeed={1}
        enableMouseInteraction
        mouseInfluence={0.25}
      />
    </div>
  ),
};
