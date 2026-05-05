import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features21Section } from "./index";
import { features21Sample } from "./config";

const meta: Meta<typeof Features21Section> = {
  title: "Sections/Features/Features21",
  component: Features21Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features21Section>;

export const Default: Story = {
  args: { ...features21Sample, id: "story-features-21" } as React.ComponentProps<
    typeof Features21Section
  >,
};
