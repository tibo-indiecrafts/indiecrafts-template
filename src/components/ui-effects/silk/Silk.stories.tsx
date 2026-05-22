import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Silk } from "./index";

const meta: Meta<typeof Silk> = {
  title: "UI Effects/Backgrounds/Silk",
  component: Silk,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Silk>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <Silk speed={5} scale={1} color="#5227FF" noiseIntensity={1.5} rotation={0} />
    </div>
  ),
};
