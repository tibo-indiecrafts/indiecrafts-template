import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ShapeBlur } from "./index";

const meta: Meta<typeof ShapeBlur> = {
  title: "UI Effects/Animations/ShapeBlur",
  component: ShapeBlur,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ShapeBlur>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <div className="relative h-[500px] w-[500px] overflow-hidden">
        <ShapeBlur
          variation={0}
          shapeSize={1}
          roundness={0.5}
          borderSize={0.05}
          circleSize={0.25}
          circleEdge={1}
        />
      </div>
    </div>
  ),
};

export const Circle: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <div className="relative h-[500px] w-[500px] overflow-hidden">
        <ShapeBlur variation={1} circleSize={0.3} circleEdge={0.6} />
      </div>
    </div>
  ),
};

export const Triangle: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <div className="relative h-[500px] w-[500px] overflow-hidden">
        <ShapeBlur variation={3} circleSize={0.25} circleEdge={0.8} />
      </div>
    </div>
  ),
};
