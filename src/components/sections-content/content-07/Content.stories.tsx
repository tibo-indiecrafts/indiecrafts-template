import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content07Section } from "./index";
import { content07Sample } from "./config";

const meta: Meta<typeof Content07Section> = {
  title: "Sections/Content/Content07",
  component: Content07Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content07Section>;

export const Default: Story = {
  args: { ...content07Sample, id: "story-content-07" } as React.ComponentProps<
    typeof Content07Section
  >,
};
