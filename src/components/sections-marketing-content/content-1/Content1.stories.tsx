import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content1Section } from "./index";
import { content1Sample } from "./config";

const meta: Meta<typeof Content1Section> = {
  title: "Sections/Marketing/Content/Content1",
  component: Content1Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content1Section>;

export const Default: Story = {
  args: { ...content1Sample, id: "story-content-1" } as React.ComponentProps<
    typeof Content1Section
  >,
};
