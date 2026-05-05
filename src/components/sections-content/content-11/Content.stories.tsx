import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content11Section } from "./index";
import { content11Sample } from "./config";

const meta: Meta<typeof Content11Section> = {
  title: "Sections/Content/Content11",
  component: Content11Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content11Section>;

export const Default: Story = {
  args: { ...content11Sample, id: "story-content-11" } as React.ComponentProps<
    typeof Content11Section
  >,
};
