import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero21Section } from "./index";
import { hero21Sample } from "./config";

const meta: Meta<typeof Hero21Section> = {
  title: "Sections/Hero/Hero21",
  component: Hero21Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Hero21Section>;
export const Default: Story = {
  args: { ...hero21Sample, id: "story-hero-21" } as React.ComponentProps<
    typeof Hero21Section
  >,
};
