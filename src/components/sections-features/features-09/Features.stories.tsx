import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features09Section } from "./index";
import { features09Sample } from "./config";

const meta: Meta<typeof Features09Section> = {
  title: "Sections/Features/Features09",
  component: Features09Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features09Section>;

export const Default: Story = {
  args: { ...features09Sample, id: "story-features-09" } as React.ComponentProps<
    typeof Features09Section
  >,
};
