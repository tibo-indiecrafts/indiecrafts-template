import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LineWaves } from "./index";

const meta: Meta<typeof LineWaves> = {
  title: "UI Effects/Backgrounds/LineWaves",
  component: LineWaves,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LineWaves>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <LineWaves
        speed={0.3}
        innerLineCount={32}
        outerLineCount={36}
        warpIntensity={1}
        rotation={-45}
        edgeFadeWidth={0}
        colorCycleSpeed={1}
        brightness={0.2}
        color1="#ffffff"
        color2="#ffffff"
        color3="#ffffff"
        enableMouseInteraction
        mouseInfluence={2}
      />
    </div>
  ),
};
