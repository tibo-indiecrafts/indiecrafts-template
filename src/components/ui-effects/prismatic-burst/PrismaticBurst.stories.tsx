import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PrismaticBurst } from "./index";

const meta: Meta<typeof PrismaticBurst> = {
  title: "UI Effects/Backgrounds/PrismaticBurst",
  component: PrismaticBurst,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof PrismaticBurst>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <PrismaticBurst
        animationType="rotate3d"
        intensity={2}
        speed={0.5}
        distort={0}
        paused={false}
        offset={{ x: 0, y: 0 }}
        hoverDampness={0.25}
        rayCount={0}
        mixBlendMode="lighten"
        colors={["#ff007a", "#4d3dff", "#ffffff"]}
      />
    </div>
  ),
};
