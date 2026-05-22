import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Plasma } from "./index";

const meta: Meta<typeof Plasma> = {
  title: "UI Effects/Backgrounds/Plasma",
  component: Plasma,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Plasma>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <Plasma
        color="#B497CF"
        speed={1}
        direction="forward"
        scale={1}
        opacity={1}
        mouseInteractive={false}
      />
    </div>
  ),
};
