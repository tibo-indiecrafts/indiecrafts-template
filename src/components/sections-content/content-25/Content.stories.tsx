import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Content from "./Content";

const meta: Meta<typeof Content> = {
  title: "Sections/Content/Content25",
  component: Content,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content>;

export const Default: Story = {
  args: { id: "content-25-storybook" },
};
