import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero18Section } from "./index";
import { hero18Sample } from "./config";

const meta: Meta<typeof Hero18Section> = {
  title: "Sections/Hero/Hero18",
  component: Hero18Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Hero18Section>;

export const Default: Story = {
  args: { ...hero18Sample, id: "story-hero-18" } as React.ComponentProps<
    typeof Hero18Section
  >,
};
