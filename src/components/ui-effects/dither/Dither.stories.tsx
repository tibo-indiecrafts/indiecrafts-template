import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Dither } from "./index";

const meta: Meta<typeof Dither> = {
  title: "UI Effects/Backgrounds/Dither",
  component: Dither,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Dither>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <Dither
        waveColor={[0.5, 0.5, 0.5]}
        disableAnimation={false}
        enableMouseInteraction
        mouseRadius={0.3}
        colorNum={4}
        waveAmplitude={0.3}
        waveFrequency={3}
        waveSpeed={0.05}
      />
    </div>
  ),
};
