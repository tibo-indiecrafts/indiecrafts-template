import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Content14Section } from "./index";
import { content14Sample } from "./config";

const meta: Meta<typeof Content14Section> = {
  title: "Sections/Content/Content14",
  component: Content14Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content14Section>;

export const Default: Story = {
  args: {
    ...content14Sample,
    id: "story-content-14",
  } as React.ComponentProps<typeof Content14Section>,
};
