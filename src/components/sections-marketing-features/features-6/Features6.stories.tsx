import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features6Section } from "./index";
import { features6Sample } from "./config";

const meta: Meta<typeof Features6Section> = {
  title: "Sections/Marketing/Features/Features6",
  component: Features6Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features6Section>;

export const Default: Story = {
  args: { ...features6Sample, id: "story-features-6" } as React.ComponentProps<
    typeof Features6Section
  >,
};
