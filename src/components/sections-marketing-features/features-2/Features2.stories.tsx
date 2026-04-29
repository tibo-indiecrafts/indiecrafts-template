import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features2Section } from "./index";
import { features2Sample } from "./config";

const meta: Meta<typeof Features2Section> = {
  title: "Sections/Marketing/Features/Features2",
  component: Features2Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features2Section>;

export const Default: Story = {
  args: { ...features2Sample, id: "story-features-2" } as React.ComponentProps<
    typeof Features2Section
  >,
};
