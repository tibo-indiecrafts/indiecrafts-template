import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content7Section } from "./index";
import { content7Sample } from "./config";

const meta: Meta<typeof Content7Section> = {
  title: "Sections/Marketing/Content/Content7",
  component: Content7Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content7Section>;

export const Default: Story = {
  args: { ...content7Sample, id: "story-content-7" } as React.ComponentProps<
    typeof Content7Section
  >,
};
