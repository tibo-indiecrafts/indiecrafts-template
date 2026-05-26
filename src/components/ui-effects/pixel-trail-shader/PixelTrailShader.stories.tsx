import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PixelTrailShader } from "./index";

const meta: Meta<typeof PixelTrailShader> = {
  title: "UI Effects/Animations/PixelTrailShader",
  component: PixelTrailShader,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof PixelTrailShader>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <div className="relative h-[500px] w-full overflow-hidden">
        <PixelTrailShader
          gridSize={50}
          trailSize={0.1}
          maxAge={250}
          interpolate={5}
          color="#5227FF"
          gooeyFilter={{ id: "custom-goo-filter", strength: 2 }}
          gooeyEnabled
        />
      </div>
    </div>
  ),
};

export const NoGoo: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw overflow-hidden bg-black">
      <PixelTrailShader
        gridSize={80}
        trailSize={0.08}
        maxAge={400}
        interpolate={8}
        color="#FF9FFC"
      />
    </div>
  ),
};
