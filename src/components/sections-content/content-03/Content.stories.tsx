import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content03Section } from "./index";
import { content03Sample } from "./config";

const meta: Meta<typeof Content03Section> = {
  title: "Sections/Content/Content03",
  component: Content03Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content03Section>;

export const Default: Story = {
  args: { ...content03Sample, id: "story-content-03" } as React.ComponentProps<
    typeof Content03Section
  >,
};
