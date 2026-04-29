import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features8Section } from "./index";
import { features8Sample } from "./config";

const meta: Meta<typeof Features8Section> = {
  title: "Sections/Marketing/Features/Features8",
  component: Features8Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features8Section>;

export const Default: Story = {
  args: { ...features8Sample, id: "story-features-8" } as React.ComponentProps<
    typeof Features8Section
  >,
};
