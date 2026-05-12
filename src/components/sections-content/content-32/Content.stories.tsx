import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Content from "./Content";
import { content32Sample } from "./config";

const meta: Meta<typeof Content> = {
  title: "Sections/Content/Content32",
  component: Content,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content>;

export const Default: Story = {
  args: { ...content32Sample, id: "content-32-storybook" },
};
