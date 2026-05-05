import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features20Section } from "./index";
import { features20Sample } from "./config";

const meta: Meta<typeof Features20Section> = {
  title: "Sections/Features/Features20",
  component: Features20Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features20Section>;

export const Default: Story = {
  args: { ...features20Sample, id: "story-features-20" } as React.ComponentProps<
    typeof Features20Section
  >,
};
