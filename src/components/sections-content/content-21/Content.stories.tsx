import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Content from "./Content";
import { content21Sample } from "./config";

const meta: Meta<typeof Content> = {
  title: "Sections/Content/Content21",
  component: Content,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content>;

export const Default: Story = {
  args: { ...content21Sample, id: "content-21-storybook" },
};
