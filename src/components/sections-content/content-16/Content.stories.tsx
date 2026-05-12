import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content16Section } from "./index";
import { content16Sample } from "./config";

const meta: Meta<typeof Content16Section> = {
  title: "Sections/Content/Content16",
  component: Content16Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content16Section>;

export const Default: Story = {
  args: {
    ...content16Sample,
    id: "story-content-16",
  } as React.ComponentProps<typeof Content16Section>,
};
