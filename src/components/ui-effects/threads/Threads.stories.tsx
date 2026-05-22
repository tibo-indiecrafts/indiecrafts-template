import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Threads } from "./index";

const meta: Meta<typeof Threads> = {
  title: "UI Effects/Backgrounds/Threads",
  component: Threads,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Threads>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <Threads amplitude={1} distance={0} enableMouseInteraction />
    </div>
  ),
};
