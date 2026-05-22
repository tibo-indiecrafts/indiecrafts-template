import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Radar } from "./index";

const meta: Meta<typeof Radar> = {
  title: "UI Effects/Backgrounds/Radar",
  component: Radar,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Radar>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <Radar
        speed={1}
        scale={0.5}
        ringCount={10}
        spokeCount={10}
        ringThickness={0.05}
        spokeThickness={0.01}
        sweepSpeed={1}
        sweepWidth={2}
        sweepLobes={1}
        color="#9f29ff"
        backgroundColor="#000000"
        falloff={2}
        brightness={1}
        enableMouseInteraction
        mouseInfluence={0.1}
      />
    </div>
  ),
};
