import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Content from "./Content";
import { content28Sample } from "./config";

const meta: Meta<typeof Content> = {
  title: "Sections/Content/Content28",
  component: Content,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Content>;

export const Default: Story = {
  args: { ...content28Sample, id: "content-28-storybook" },
};
