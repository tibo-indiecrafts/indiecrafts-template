import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Content from "./Content";
import { content24Sample } from "./config";

const meta: Meta<typeof Content> = {
  title: "Sections/Content/Content24",
  component: Content,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content>;

export const Default: Story = {
  args: { ...content24Sample, id: "content-24-storybook" },
};
