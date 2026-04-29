import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content2Section } from "./index";
import { content2Sample } from "./config";

const meta: Meta<typeof Content2Section> = {
  title: "Sections/Marketing/Content/Content2",
  component: Content2Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content2Section>;

export const Default: Story = {
  args: { ...content2Sample, id: "story-content-2" } as React.ComponentProps<
    typeof Content2Section
  >,
};
