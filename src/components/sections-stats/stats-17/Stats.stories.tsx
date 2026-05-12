import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Stats from "./Stats";
import { stats17Sample } from "./config";

const meta: Meta<typeof Stats> = {
  title: "Sections/Stats/Stats17",
  component: Stats,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Stats>;

export const Default: Story = {
  args: { ...stats17Sample, id: "stats-17-storybook" },
};
