import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TextPressure } from "./index";

const meta: Meta<typeof TextPressure> = {
  title: "UI Effects/Text/TextPressure",
  component: TextPressure,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TextPressure>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black px-8">
      <div className="relative h-[60vh] w-full max-w-5xl">
        <TextPressure
          text="Hello!"
          flex
          alpha={false}
          stroke={false}
          width
          weight
          italic
          scale
          textColor="#ffffff"
          strokeColor="#5227FF"
          minFontSize={36}
        />
      </div>
    </div>
  ),
};
