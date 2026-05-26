import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Cubes } from "./index";

const meta: Meta<typeof Cubes> = {
  title: "UI Effects/Animations/Cubes",
  component: Cubes,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Cubes>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black p-8">
      <div className="relative flex h-[600px] w-full items-center justify-center">
        <Cubes
          gridSize={8}
          maxAngle={45}
          radius={3}
          borderStyle="2px dashed #B497CF"
          faceColor="#1a1a2e"
          rippleColor="#ff6b6b"
          rippleSpeed={1.5}
          autoAnimate
          rippleOnClick
        />
      </div>
    </div>
  ),
};

export const Dense: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black p-8">
      <div className="relative flex h-[700px] w-full items-center justify-center">
        <Cubes
          gridSize={14}
          maxAngle={60}
          radius={4}
          borderStyle="1px solid rgba(255,255,255,0.4)"
          faceColor="#0a0a14"
          rippleColor="#5227FF"
          rippleSpeed={2}
          autoAnimate
          rippleOnClick
        />
      </div>
    </div>
  ),
};
