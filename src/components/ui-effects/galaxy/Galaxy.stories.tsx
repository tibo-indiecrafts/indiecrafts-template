import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Galaxy } from "./index";

const meta: Meta<typeof Galaxy> = {
  title: "UI Effects/Backgrounds/Galaxy",
  component: Galaxy,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Galaxy>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <Galaxy />
    </div>
  ),
};

export const CustomParams: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <Galaxy
        mouseRepulsion
        mouseInteraction
        density={1}
        glowIntensity={0.3}
        saturation={0}
        hueShift={140}
        twinkleIntensity={0.3}
        rotationSpeed={0.1}
        repulsionStrength={2}
        autoCenterRepulsion={0}
        starSpeed={0.5}
        speed={1}
      />
    </div>
  ),
};
