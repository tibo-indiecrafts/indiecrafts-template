import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Content from "./Content";
import { content29Sample } from "./config";

const meta: Meta<typeof Content> = {
  title: "Sections/Content/Content29",
  component: Content,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content>;

export const Default: Story = {
  args: { ...content29Sample, id: "content-29-storybook" },
};
