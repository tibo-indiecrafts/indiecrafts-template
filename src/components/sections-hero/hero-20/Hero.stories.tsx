import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero20Section } from "./index";
import { hero20Sample } from "./config";

const meta: Meta<typeof Hero20Section> = {
  title: "Sections/Hero/Hero20",
  component: Hero20Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Hero20Section>;
export const Default: Story = {
  args: { ...hero20Sample, id: "story-hero-20" } as React.ComponentProps<
    typeof Hero20Section
  >,
};
