import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features9Section } from "./index";
import { features9Sample } from "./config";

const meta: Meta<typeof Features9Section> = {
  title: "Sections/Marketing/Features/Features9",
  component: Features9Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features9Section>;

export const Default: Story = {
  args: { ...features9Sample, id: "story-features-9" } as React.ComponentProps<
    typeof Features9Section
  >,
};
