import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PlasmaWave } from "./index";

const meta: Meta<typeof PlasmaWave> = {
  title: "UI Effects/Backgrounds/PlasmaWave",
  component: PlasmaWave,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof PlasmaWave>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <PlasmaWave
        colors={["#A855F7", "#06B6D4"]}
        speed1={0.05}
        speed2={0.05}
        focalLength={0.8}
        bend1={1}
        bend2={0.5}
        dir2={1}
        rotationDeg={0}
      />
    </div>
  ),
};
