import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ColorBends } from "./index";

const meta: Meta<typeof ColorBends> = {
  title: "UI Effects/Backgrounds/ColorBends",
  component: ColorBends,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ColorBends>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <ColorBends
        colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
        rotation={90}
        speed={0.2}
        scale={1}
        frequency={1}
        warpStrength={1}
        mouseInfluence={1}
        noise={0.15}
        parallax={0.5}
        iterations={1}
        intensity={1.5}
        bandWidth={6}
        transparent
        autoRotate={0}
      />
    </div>
  ),
};
