import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ParallaxImage } from "./ParallaxImage";

const meta: Meta<typeof ParallaxImage> = {
  title: "UI Effects/Marquees & Scroll/ParallaxImage",
  component: ParallaxImage,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ParallaxImage>;

export const Default: Story = {};
