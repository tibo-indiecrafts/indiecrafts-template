import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RippleGrid } from "./index";

const meta: Meta<typeof RippleGrid> = {
  title: "UI Effects/Backgrounds/RippleGrid",
  component: RippleGrid,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof RippleGrid>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <RippleGrid
        enableRainbow={false}
        gridColor="#5227FF"
        rippleIntensity={0.05}
        gridSize={10}
        gridThickness={15}
        mouseInteraction
        mouseInteractionRadius={0.8}
        opacity={1}
        fadeDistance={1.5}
        vignetteStrength={2}
        glowIntensity={0.1}
        gridRotation={0}
      />
    </div>
  ),
};
