import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Ballpit } from "./index";

const meta: Meta<typeof Ballpit> = {
  title: "UI Effects/Backgrounds/Ballpit",
  component: Ballpit,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Ballpit>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw overflow-hidden bg-black">
      <Ballpit
        count={100}
        gravity={0.01}
        friction={0.9975}
        wallBounce={0.95}
        followCursor={false}
        colors={[0xff5733, 0x33c1ff, 0xa0e6a3, 0xf2a900]}
        ambientColor={0xffffff}
        ambientIntensity={1}
        lightIntensity={200}
      />
    </div>
  ),
};
