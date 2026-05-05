import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features22Section } from "./index";
import { features22Sample } from "./config";

const meta: Meta<typeof Features22Section> = {
  title: "Sections/Features/Features22",
  component: Features22Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features22Section>;

export const Default: Story = {
  args: { ...features22Sample, id: "story-features-22" } as React.ComponentProps<
    typeof Features22Section
  >,
};
