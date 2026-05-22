import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ASCIIText } from "./index";

const meta: Meta<typeof ASCIIText> = {
  title: "UI Effects/Text/ASCIIText",
  component: ASCIIText,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ASCIIText>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <ASCIIText text="Hey!" enableWaves asciiFontSize={8} />
    </div>
  ),
};
