import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Hero from "./Hero";
import { hero22Sample } from "./config";

const meta: Meta<typeof Hero> = {
  title: "Sections/Hero/Hero22",
  component: Hero,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: { ...hero22Sample, id: "hero-22-storybook" },
};
