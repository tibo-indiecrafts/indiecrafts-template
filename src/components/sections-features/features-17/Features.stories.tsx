import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features17Section } from "./index";
import { features17Sample } from "./config";

const meta: Meta<typeof Features17Section> = {
  title: "Sections/Features/Features17",
  component: Features17Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features17Section>;

export const Default: Story = {
  args: { ...features17Sample, id: "story-features-17" } as React.ComponentProps<
    typeof Features17Section
  >,
};
