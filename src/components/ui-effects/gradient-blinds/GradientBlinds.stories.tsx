import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GradientBlinds } from "./index";

const meta: Meta<typeof GradientBlinds> = {
  title: "UI Effects/Backgrounds/GradientBlinds",
  component: GradientBlinds,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof GradientBlinds>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <GradientBlinds
        gradientColors={["#FF9FFC", "#5227FF"]}
        angle={20}
        noise={0.5}
        blindCount={16}
        blindMinWidth={60}
        spotlightRadius={0.5}
        spotlightSoftness={1}
        spotlightOpacity={1}
        mouseDampening={0.15}
        distortAmount={0}
        shineDirection="left"
        mixBlendMode="lighten"
      />
    </div>
  ),
};
