import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features23Section } from "./index";
import { features23Sample } from "./config";

const meta: Meta<typeof Features23Section> = {
  title: "Sections/Features/Features23",
  component: Features23Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features23Section>;

export const Default: Story = {
  args: { ...features23Sample, id: "story-features-23" } as React.ComponentProps<
    typeof Features23Section
  >,
};
