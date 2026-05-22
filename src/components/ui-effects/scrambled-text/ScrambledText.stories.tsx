import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ScrambledText } from "./index";

const meta: Meta<typeof ScrambledText> = {
  title: "UI Effects/Text/ScrambledText",
  component: ScrambledText,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ScrambledText>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <ScrambledText radius={100} duration={1.2} speed={0.5} scrambleChars=".:">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique pariatur
        dignissimos porro eius quam doloremque et enim velit nobis maxime.
      </ScrambledText>
    </div>
  ),
};
