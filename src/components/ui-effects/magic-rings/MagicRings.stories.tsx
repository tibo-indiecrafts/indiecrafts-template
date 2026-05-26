import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MagicRings } from "./index";

const meta: Meta<typeof MagicRings> = {
  title: "UI Effects/Animations/MagicRings",
  component: MagicRings,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof MagicRings>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <div className="relative h-[400px] w-[600px]">
        <MagicRings
          color="#A855F7"
          colorTwo="#6366F1"
          ringCount={6}
          speed={1}
          attenuation={10}
          lineThickness={2}
          baseRadius={0.35}
          radiusStep={0.1}
          scaleRate={0.1}
          opacity={1}
          blur={0}
          noiseAmount={0.1}
          rotation={0}
          ringGap={1.5}
          fadeIn={0.7}
          fadeOut={0.5}
          followMouse={false}
          mouseInfluence={0.2}
          hoverScale={1.2}
          parallax={0.05}
          clickBurst={false}
        />
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <div className="relative h-[600px] w-[800px]">
        <MagicRings
          color="#fc42ff"
          colorTwo="#42fcff"
          ringCount={8}
          speed={1.2}
          attenuation={8}
          lineThickness={2.5}
          followMouse
          mouseInfluence={0.3}
          hoverScale={1.3}
          parallax={0.08}
          clickBurst
        />
      </div>
    </div>
  ),
};
