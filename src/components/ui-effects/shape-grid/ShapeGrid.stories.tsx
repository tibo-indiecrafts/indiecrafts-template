import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ShapeGrid } from "./index";

const meta: Meta<typeof ShapeGrid> = {
  title: "UI Effects/Backgrounds/ShapeGrid",
  component: ShapeGrid,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ShapeGrid>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw overflow-hidden bg-black">
      <ShapeGrid
        speed={0.5}
        squareSize={40}
        direction="diagonal"
        borderColor="#2F293A"
        hoverFillColor="#222"
        shape="square"
        hoverTrailAmount={0}
      />
    </div>
  ),
};
