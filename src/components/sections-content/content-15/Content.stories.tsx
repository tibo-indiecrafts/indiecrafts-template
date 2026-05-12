import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content15Section } from "./index";
import { content15Sample } from "./config";

const meta: Meta<typeof Content15Section> = {
  title: "Sections/Content/Content15",
  component: Content15Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content15Section>;

export const Default: Story = {
  args: {
    ...content15Sample,
    id: "story-content-15",
  } as React.ComponentProps<typeof Content15Section>,
};
