import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Hero from "./Hero";
import { hero25Sample } from "./config";

const meta: Meta<typeof Hero> = {
  title: "Sections/Hero/Hero25",
  component: Hero,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: { ...hero25Sample, id: "hero-25-storybook" },
};
