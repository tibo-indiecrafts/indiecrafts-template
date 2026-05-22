import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PixelBlast } from "./index";

const meta: Meta<typeof PixelBlast> = {
  title: "UI Effects/Backgrounds/PixelBlast",
  component: PixelBlast,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof PixelBlast>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <PixelBlast
        variant="square"
        pixelSize={4}
        color="#B497CF"
        patternScale={2}
        patternDensity={1}
        pixelSizeJitter={0}
        enableRipples
        rippleSpeed={0.4}
        rippleThickness={0.12}
        rippleIntensityScale={1.5}
        liquid={false}
        liquidStrength={0.12}
        liquidRadius={1.2}
        liquidWobbleSpeed={5}
        speed={0.5}
        edgeFade={0.25}
        transparent
      />
    </div>
  ),
};
