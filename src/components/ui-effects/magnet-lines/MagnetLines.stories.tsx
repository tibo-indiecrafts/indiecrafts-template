import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MagnetLines } from "./index";

const meta: Meta<typeof MagnetLines> = {
  title: "UI Effects/Animations/MagnetLines",
  component: MagnetLines,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof MagnetLines>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <MagnetLines
        rows={10}
        columns={12}
        containerSize="40vmin"
        lineColor="#efefef"
        lineWidth="2px"
        lineHeight="30px"
        baseAngle={-10}
        style={{ margin: "2rem auto" }}
      />
    </div>
  ),
};

export const Dense: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <MagnetLines
        rows={18}
        columns={18}
        containerSize="70vmin"
        lineColor="#5227FF"
        lineWidth="3px"
        lineHeight="36px"
        baseAngle={0}
      />
    </div>
  ),
};
