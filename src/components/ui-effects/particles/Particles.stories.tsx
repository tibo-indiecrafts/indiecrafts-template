import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Particles } from "./index";

const meta: Meta<typeof Particles> = {
  title: "UI Effects/Backgrounds/Particles",
  component: Particles,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Particles>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <Particles
        particleColors={["#ffffff"]}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover
        alphaParticles={false}
        disableRotation={false}
        pixelRatio={1}
      />
    </div>
  ),
};
