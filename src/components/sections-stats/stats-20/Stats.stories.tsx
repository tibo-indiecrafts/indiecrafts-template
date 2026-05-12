import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Stats from "./Stats";
import { stats20Sample } from "./config";

const meta: Meta<typeof Stats> = {
  title: "Sections/Stats/Stats20",
  component: Stats,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Stats>;

export const Default: Story = {
  args: { ...stats20Sample, id: "stats-20-storybook" },
};
