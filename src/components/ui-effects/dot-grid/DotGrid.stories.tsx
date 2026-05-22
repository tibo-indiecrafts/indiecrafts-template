import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DotGrid } from "./index";

const meta: Meta<typeof DotGrid> = {
  title: "UI Effects/Backgrounds/DotGrid",
  component: DotGrid,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof DotGrid>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <DotGrid
        dotSize={5}
        gap={15}
        baseColor="#2F293A"
        activeColor="#5227FF"
        proximity={120}
        shockRadius={250}
        shockStrength={5}
        resistance={750}
        returnDuration={1.5}
      />
    </div>
  ),
};
