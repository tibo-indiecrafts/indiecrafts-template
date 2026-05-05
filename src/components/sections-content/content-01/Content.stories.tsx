import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content01Section } from "./index";
import { content01Sample } from "./config";

const meta: Meta<typeof Content01Section> = {
  title: "Sections/Content/Content01",
  component: Content01Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content01Section>;

export const Default: Story = {
  args: { ...content01Sample, id: "story-content-01" } as React.ComponentProps<
    typeof Content01Section
  >,
};
