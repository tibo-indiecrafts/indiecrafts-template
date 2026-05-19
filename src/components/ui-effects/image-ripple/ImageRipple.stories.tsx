import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ImageRipple } from "./index";

const meta: Meta<typeof ImageRipple> = {
  title: "UI Effects/Particles & Effects/ImageRipple",
  component: ImageRipple,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ImageRipple>;

export const Default: Story = {
  render: () => <ImageRipple />,
};
