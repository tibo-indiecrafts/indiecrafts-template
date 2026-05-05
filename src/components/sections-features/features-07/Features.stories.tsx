import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features07Section } from "./index";
import { features07Sample } from "./config";

const meta: Meta<typeof Features07Section> = {
  title: "Sections/Features/Features07",
  component: Features07Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features07Section>;

export const Default: Story = {
  args: { ...features07Sample, id: "story-features-07" } as React.ComponentProps<
    typeof Features07Section
  >,
};
