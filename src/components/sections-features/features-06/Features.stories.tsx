import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features06Section } from "./index";
import { features06Sample } from "./config";

const meta: Meta<typeof Features06Section> = {
  title: "Sections/Features/Features06",
  component: Features06Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features06Section>;

export const Default: Story = {
  args: { ...features06Sample, id: "story-features-06" } as React.ComponentProps<
    typeof Features06Section
  >,
};
