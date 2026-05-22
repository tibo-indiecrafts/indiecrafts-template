import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Lightning } from "./index";

const meta: Meta<typeof Lightning> = {
  title: "UI Effects/Backgrounds/Lightning",
  component: Lightning,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Lightning>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <Lightning hue={260} xOffset={0} speed={1} intensity={1} size={1} />
    </div>
  ),
};
