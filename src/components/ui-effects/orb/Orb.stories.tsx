import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Orb } from "./index";

const meta: Meta<typeof Orb> = {
  title: "UI Effects/Backgrounds/Orb",
  component: Orb,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Orb>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <Orb
        hoverIntensity={2}
        rotateOnHover
        hue={0}
        forceHoverState={false}
        backgroundColor="#000000"
      />
    </div>
  ),
};
