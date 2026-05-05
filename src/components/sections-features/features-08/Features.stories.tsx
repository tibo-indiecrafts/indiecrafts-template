import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features08Section } from "./index";
import { features08Sample } from "./config";

const meta: Meta<typeof Features08Section> = {
  title: "Sections/Features/Features08",
  component: Features08Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features08Section>;

export const Default: Story = {
  args: { ...features08Sample, id: "story-features-08" } as React.ComponentProps<
    typeof Features08Section
  >,
};
