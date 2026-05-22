import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Iridescence } from "./index";

const meta: Meta<typeof Iridescence> = {
  title: "UI Effects/Backgrounds/Iridescence",
  component: Iridescence,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Iridescence>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <Iridescence color={[0.5, 0.6, 0.8]} mouseReact amplitude={0.1} speed={1} />
    </div>
  ),
};
