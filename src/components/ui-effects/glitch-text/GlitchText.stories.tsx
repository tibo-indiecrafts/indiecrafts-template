import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GlitchText } from "./index";

const meta: Meta<typeof GlitchText> = {
  title: "UI Effects/Text/GlitchText",
  component: GlitchText,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof GlitchText>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <GlitchText speed={1} enableShadows enableOnHover={false}>
        React Bits
      </GlitchText>
    </div>
  ),
};

export const HoverOnly: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black">
      <GlitchText speed={0.8} enableShadows enableOnHover>
        Hover Me
      </GlitchText>
    </div>
  ),
};
