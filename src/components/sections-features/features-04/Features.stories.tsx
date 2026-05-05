import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features04Section } from "./index";
import { features04Sample } from "./config";

const meta: Meta<typeof Features04Section> = {
  title: "Sections/Features/Features04",
  component: Features04Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features04Section>;

export const Default: Story = {
  args: { ...features04Sample, id: "story-features-04" } as React.ComponentProps<
    typeof Features04Section
  >,
};
