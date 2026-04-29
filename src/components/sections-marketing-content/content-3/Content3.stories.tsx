import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content3Section } from "./index";
import { content3Sample } from "./config";

const meta: Meta<typeof Content3Section> = {
  title: "Sections/Marketing/Content/Content3",
  component: Content3Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content3Section>;

export const Default: Story = {
  args: { ...content3Sample, id: "story-content-3" } as React.ComponentProps<
    typeof Content3Section
  >,
};
