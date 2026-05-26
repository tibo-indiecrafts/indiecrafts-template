import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GlareHover } from "./index";

const meta: Meta<typeof GlareHover> = {
  title: "UI Effects/Animations/GlareHover",
  component: GlareHover,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof GlareHover>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <GlareHover
        width="500px"
        height="300px"
        background="#0a0a0a"
        borderColor="#262626"
        glareColor="#ffffff"
        glareOpacity={0.3}
        glareAngle={-30}
        glareSize={300}
        transitionDuration={800}
        playOnce={false}
      >
        <h2 className="m-0 text-5xl font-black text-white">Hover Me</h2>
      </GlareHover>
    </div>
  ),
};

export const DarkCard: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <GlareHover
        width="500px"
        height="500px"
        background="#111"
        borderColor="#5227FF"
        glareColor="#A855F7"
        glareOpacity={0.6}
        glareAngle={-40}
        glareSize={250}
        transitionDuration={650}
      >
        <h2 className="m-0 text-5xl font-black text-white">Hover Me</h2>
      </GlareHover>
    </div>
  ),
};
