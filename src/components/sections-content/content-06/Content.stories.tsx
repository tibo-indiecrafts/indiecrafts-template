import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content06Section } from "./index";
import { content06Sample } from "./config";

const meta: Meta<typeof Content06Section> = {
  title: "Sections/Content/Content06",
  component: Content06Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content06Section>;

export const Default: Story = {
  args: { ...content06Sample, id: "story-content-06" } as React.ComponentProps<
    typeof Content06Section
  >,
};
