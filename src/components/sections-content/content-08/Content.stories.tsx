import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content08Section } from "./index";
import { content08Sample } from "./config";

const meta: Meta<typeof Content08Section> = {
  title: "Sections/Content/Content08",
  component: Content08Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content08Section>;

export const Default: Story = {
  args: { ...content08Sample, id: "story-content-08" } as React.ComponentProps<
    typeof Content08Section
  >,
};
