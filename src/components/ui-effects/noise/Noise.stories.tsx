import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Noise } from "./index";

const meta: Meta<typeof Noise> = {
  title: "UI Effects/Animations/Noise",
  component: Noise,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Noise>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <div className="relative h-[400px] w-[600px] overflow-hidden bg-neutral-900">
        <Noise
          patternSize={250}
          patternScaleX={2}
          patternScaleY={2}
          patternRefreshInterval={2}
          patternAlpha={15}
        />
      </div>
    </div>
  ),
};

export const Fullscreen: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw overflow-hidden bg-neutral-950">
      <Noise patternSize={512} patternAlpha={25} patternRefreshInterval={1} />
    </div>
  ),
};
