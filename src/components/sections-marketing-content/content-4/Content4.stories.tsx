import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content4Section } from "./index";
import { content4Sample } from "./config";

const meta: Meta<typeof Content4Section> = {
  title: "Sections/Marketing/Content/Content4",
  component: Content4Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content4Section>;

export const Default: Story = {
  args: { ...content4Sample, id: "story-content-4" } as React.ComponentProps<
    typeof Content4Section
  >,
};
