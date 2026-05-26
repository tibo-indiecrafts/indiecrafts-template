import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MetaBalls } from "./index";

const meta: Meta<typeof MetaBalls> = {
  title: "UI Effects/Animations/MetaBalls",
  component: MetaBalls,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof MetaBalls>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <MetaBalls
        color="#ffffff"
        cursorBallColor="#ffffff"
        cursorBallSize={2}
        ballCount={15}
        animationSize={30}
        enableMouseInteraction
        enableTransparency
        hoverSmoothness={0.15}
        clumpFactor={1}
        speed={0.3}
      />
    </div>
  ),
};

export const Indigo: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <MetaBalls
        color="#5227FF"
        cursorBallColor="#A855F7"
        cursorBallSize={3}
        ballCount={25}
        animationSize={40}
        enableMouseInteraction
        enableTransparency
        hoverSmoothness={0.2}
        clumpFactor={1.2}
        speed={0.4}
      />
    </div>
  ),
};
