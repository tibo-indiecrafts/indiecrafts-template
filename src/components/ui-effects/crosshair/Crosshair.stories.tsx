import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { Crosshair } from "./index";

const meta: Meta<typeof Crosshair> = {
  title: "UI Effects/Hover & Interactions/Crosshair",
  component: Crosshair,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Crosshair>;

function ContainerStage() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  return (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black p-8">
      <div
        ref={containerRef}
        className="relative h-[300px] w-full max-w-3xl overflow-hidden bg-neutral-900"
      >
        <Crosshair containerRef={containerRef} color="#ffffff" />
        <div className="flex h-full w-full items-center justify-center text-white/60">
          Move inside this box
        </div>
      </div>
    </div>
  );
}

export const Showcase: Story = {
  render: () => <ContainerStage />,
};

export const FullViewport: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <Crosshair color="#5227FF" />
      <div className="flex h-full w-full items-center justify-center text-white">
        <a href="#" className="text-2xl underline">
          Hover this link to trigger the wobble
        </a>
      </div>
    </div>
  ),
};
