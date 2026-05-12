import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Stats from "./Stats";
import { stats18Sample } from "./config";

const meta: Meta<typeof Stats> = {
  title: "Sections/Stats/Stats18",
  component: Stats,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Stats>;

export const Default: Story = {
  args: { ...stats18Sample, id: "stats-18-storybook" },
};
