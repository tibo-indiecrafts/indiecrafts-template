import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content17Section } from "./index";
import { content17Sample } from "./config";

const meta: Meta<typeof Content17Section> = {
  title: "Sections/Content/Content17",
  component: Content17Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content17Section>;

export const Default: Story = {
  args: {
    ...content17Sample,
    id: "story-content-17",
  } as React.ComponentProps<typeof Content17Section>,
};
