import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features03Section } from "./index";
import { features03Sample } from "./config";

const meta: Meta<typeof Features03Section> = {
  title: "Sections/Features/Features03",
  component: Features03Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features03Section>;

export const Default: Story = {
  args: { ...features03Sample, id: "story-features-03" } as React.ComponentProps<
    typeof Features03Section
  >,
};
