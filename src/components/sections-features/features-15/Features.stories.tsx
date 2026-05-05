import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features15Section } from "./index";
import { features15Sample } from "./config";

const meta: Meta<typeof Features15Section> = {
  title: "Sections/Features/Features15",
  component: Features15Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features15Section>;

export const Default: Story = {
  args: { ...features15Sample, id: "story-features-15" } as React.ComponentProps<
    typeof Features15Section
  >,
};
