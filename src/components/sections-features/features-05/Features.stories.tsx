import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features05Section } from "./index";
import { features05Sample } from "./config";

const meta: Meta<typeof Features05Section> = {
  title: "Sections/Features/Features05",
  component: Features05Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features05Section>;

export const Default: Story = {
  args: { ...features05Sample, id: "story-features-05" } as React.ComponentProps<
    typeof Features05Section
  >,
};
