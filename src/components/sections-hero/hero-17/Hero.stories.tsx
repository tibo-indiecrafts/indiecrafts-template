import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero17Section } from "./index";
import { hero17Sample } from "./config";

const meta: Meta<typeof Hero17Section> = {
  title: "Sections/Hero/Hero17",
  component: Hero17Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Hero17Section>;

export const Default: Story = {
  args: { ...hero17Sample, id: "story-hero-17" } as React.ComponentProps<
    typeof Hero17Section
  >,
};
