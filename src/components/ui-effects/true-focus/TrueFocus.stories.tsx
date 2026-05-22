import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TrueFocus } from "./index";

const meta: Meta<typeof TrueFocus> = {
  title: "UI Effects/Text/TrueFocus",
  component: TrueFocus,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TrueFocus>;

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black text-white">
      <TrueFocus
        sentence="True Focus"
        manualMode={false}
        blurAmount={5}
        borderColor="#5227FF"
        animationDuration={0.5}
        pauseBetweenAnimations={1}
      />
    </div>
  ),
};

export const Manual: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black text-white">
      <TrueFocus
        sentence="Hover to focus a word"
        manualMode
        blurAmount={6}
        borderColor="#FF9FFC"
        animationDuration={0.4}
      />
    </div>
  ),
};
