import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Prism } from "./index";

const meta: Meta<typeof Prism> = {
  title: "UI Effects/Backgrounds/Prism",
  component: Prism,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Prism>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <Prism
        animationType="rotate"
        timeScale={0.5}
        height={3.5}
        baseWidth={5.5}
        scale={3.6}
        hueShift={0}
        colorFrequency={1}
        noise={0}
        glow={1}
      />
    </div>
  ),
};

export const Hover: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <Prism
        animationType="hover"
        height={3.5}
        baseWidth={5.5}
        scale={3.6}
        hoverStrength={2}
        inertia={0.05}
        noise={0}
        glow={1}
      />
    </div>
  ),
};

export const Rotate3D: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <Prism
        animationType="3drotate"
        timeScale={0.6}
        height={3.5}
        baseWidth={5.5}
        scale={3.6}
        hueShift={0.4}
        glow={1.2}
      />
    </div>
  ),
};
