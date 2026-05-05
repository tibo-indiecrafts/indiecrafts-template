import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features14Section } from "./index";
import { features14Sample } from "./config";

const meta: Meta<typeof Features14Section> = {
  title: "Sections/Features/Features14",
  component: Features14Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features14Section>;

export const Default: Story = {
  args: { ...features14Sample, id: "story-features-14" } as React.ComponentProps<
    typeof Features14Section
  >,
};
