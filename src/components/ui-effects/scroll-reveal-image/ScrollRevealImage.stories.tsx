import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScrollRevealImage } from "./ScrollRevealImage";

const meta: Meta<typeof ScrollRevealImage> = {
  title: "UI Effects/Marquees & Scroll/ScrollRevealImage",
  component: ScrollRevealImage,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ScrollRevealImage>;

export const Default: Story = {};
