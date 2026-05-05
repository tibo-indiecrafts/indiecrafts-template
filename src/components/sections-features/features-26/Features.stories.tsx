import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features26Section } from "./index";
import { features26Sample } from "./config";

const meta: Meta<typeof Features26Section> = {
  title: "Sections/Features/Features26",
  component: Features26Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features26Section>;

export const Default: Story = {
  args: { ...features26Sample, id: "story-features-26" } as React.ComponentProps<
    typeof Features26Section
  >,
};
