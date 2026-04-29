import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content5Section } from "./index";
import { content5Sample } from "./config";

const meta: Meta<typeof Content5Section> = {
  title: "Sections/Marketing/Content/Content5",
  component: Content5Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content5Section>;

export const Default: Story = {
  args: { ...content5Sample, id: "story-content-5" } as React.ComponentProps<
    typeof Content5Section
  >,
};
