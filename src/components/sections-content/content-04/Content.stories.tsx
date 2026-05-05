import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content04Section } from "./index";
import { content04Sample } from "./config";

const meta: Meta<typeof Content04Section> = {
  title: "Sections/Content/Content04",
  component: Content04Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content04Section>;

export const Default: Story = {
  args: { ...content04Sample, id: "story-content-04" } as React.ComponentProps<
    typeof Content04Section
  >,
};
