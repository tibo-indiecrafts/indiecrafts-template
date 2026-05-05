import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content09Section } from "./index";
import { content09Sample } from "./config";

const meta: Meta<typeof Content09Section> = {
  title: "Sections/Content/Content09",
  component: Content09Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content09Section>;

export const Default: Story = {
  args: { ...content09Sample, id: "story-content-09" } as React.ComponentProps<
    typeof Content09Section
  >,
};
