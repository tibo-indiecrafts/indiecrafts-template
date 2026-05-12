import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Content from "./Content";
import { content22Sample } from "./config";

const meta: Meta<typeof Content> = {
  title: "Sections/Content/Content22",
  component: Content,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content>;

export const Default: Story = {
  args: { ...content22Sample, id: "content-22-storybook" },
};
