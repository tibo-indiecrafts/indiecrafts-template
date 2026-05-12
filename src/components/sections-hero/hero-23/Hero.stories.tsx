import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Hero from "./Hero";
import { hero23Sample } from "./config";

const meta: Meta<typeof Hero> = {
  title: "Sections/Hero/Hero23",
  component: Hero,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: { ...hero23Sample, id: "hero-23-storybook" },
};
