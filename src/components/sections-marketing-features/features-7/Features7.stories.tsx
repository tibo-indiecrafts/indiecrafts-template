import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features7Section } from "./index";
import { features7Sample } from "./config";

const meta: Meta<typeof Features7Section> = {
  title: "Sections/Marketing/Features/Features7",
  component: Features7Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features7Section>;

export const Default: Story = {
  args: { ...features7Sample, id: "story-features-7" } as React.ComponentProps<
    typeof Features7Section
  >,
};
