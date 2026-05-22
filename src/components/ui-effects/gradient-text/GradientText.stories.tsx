import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GradientText } from "./index";

const meta: Meta<typeof GradientText> = {
  title: "UI Effects/Text/GradientText",
  component: GradientText,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof GradientText>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black text-[3rem]">
      <GradientText
        colors={["#5227FF", "#FF9FFC", "#B497CF"]}
        animationSpeed={8}
        showBorder={false}
      >
        Add a splash of color!
      </GradientText>
    </div>
  ),
};

export const WithBorder: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black text-[2.5rem]">
      <GradientText
        colors={["#5227FF", "#FF9FFC", "#B497CF", "#5227FF"]}
        animationSpeed={6}
        showBorder
      >
        Bordered Gradient
      </GradientText>
    </div>
  ),
};
