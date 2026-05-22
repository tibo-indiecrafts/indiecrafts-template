import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Aurora } from "./index";

const meta: Meta<typeof Aurora> = {
  title: "UI Effects/Backgrounds/Aurora",
  component: Aurora,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Aurora>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <Aurora
        colorStops={["#7cff67", "#B497CF", "#5227FF"]}
        blend={0.5}
        amplitude={1.0}
        speed={1}
      />
    </div>
  ),
};
