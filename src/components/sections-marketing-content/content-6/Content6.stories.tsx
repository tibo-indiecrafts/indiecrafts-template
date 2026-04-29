import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content6Section } from "./index";
import { content6Sample } from "./config";

const meta: Meta<typeof Content6Section> = {
  title: "Sections/Marketing/Content/Content6",
  component: Content6Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content6Section>;

export const Default: Story = {
  args: { ...content6Sample, id: "story-content-6" } as React.ComponentProps<
    typeof Content6Section
  >,
};
