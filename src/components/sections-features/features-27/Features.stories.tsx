import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features27Section } from "./index";
import { features27Sample } from "./config";

const meta: Meta<typeof Features27Section> = {
  title: "Sections/Features/Features27",
  component: Features27Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features27Section>;

export const Default: Story = {
  args: { ...features27Sample, id: "story-features-27" } as React.ComponentProps<
    typeof Features27Section
  >,
};
