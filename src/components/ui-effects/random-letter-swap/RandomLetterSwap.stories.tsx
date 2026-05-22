import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RandomLetterSwapForward, RandomLetterSwapPingPong } from "./index";

const meta: Meta<typeof RandomLetterSwapForward> = {
  title: "UI Effects/Text/RandomLetterSwap",
  component: RandomLetterSwapForward,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof RandomLetterSwapForward>;

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col items-center justify-center gap-2 text-3xl text-red-500 md:gap-3 md:text-5xl">
      <RandomLetterSwapForward label="Right here!" reverse />
      <RandomLetterSwapForward
        label="Right now!"
        reverse={false}
        className="px-4 font-bold italic"
      />
      <RandomLetterSwapPingPong label="Right here!" />
      <RandomLetterSwapPingPong
        label="Right now!"
        reverse={false}
        className="font-bold"
      />
    </div>
  ),
};
