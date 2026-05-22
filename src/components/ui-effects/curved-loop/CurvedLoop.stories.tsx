import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CurvedLoop } from "./index";

const meta: Meta<typeof CurvedLoop> = {
  title: "UI Effects/Text/CurvedLoop",
  component: CurvedLoop,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CurvedLoop>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black text-white">
      <CurvedLoop marqueeText="Welcome to React Bits *" />
    </div>
  ),
};

export const Custom: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black text-white">
      <CurvedLoop
        marqueeText="Be * Creative * With * React * Bits *"
        speed={2}
        curveAmount={400}
        direction="right"
        interactive
      />
    </div>
  ),
};
