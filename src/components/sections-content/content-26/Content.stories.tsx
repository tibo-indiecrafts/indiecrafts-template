import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Content from "./Content";

const meta: Meta<typeof Content> = {
  title: "Sections/Content/Content26",
  component: Content,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content>;

export const Default: Story = {
  args: { id: "content-26-storybook" },
};
