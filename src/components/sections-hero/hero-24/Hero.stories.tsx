import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Hero from "./Hero";
import { hero24Sample } from "./config";

const meta: Meta<typeof Hero> = {
  title: "Sections/Hero/Hero24",
  component: Hero,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: { ...hero24Sample, id: "hero-24-storybook" },
};
