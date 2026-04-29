import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features3Section } from "./index";
import { features3Sample } from "./config";

const meta: Meta<typeof Features3Section> = {
  title: "Sections/Marketing/Features/Features3",
  component: Features3Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features3Section>;

export const Default: Story = {
  args: { ...features3Sample, id: "story-features-3" } as React.ComponentProps<
    typeof Features3Section
  >,
};
