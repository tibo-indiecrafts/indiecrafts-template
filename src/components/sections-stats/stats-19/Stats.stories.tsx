import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Stats from "./Stats";
import { stats19Sample } from "./config";

const meta: Meta<typeof Stats> = {
  title: "Sections/Stats/Stats19",
  component: Stats,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Stats>;

export const Default: Story = {
  args: { ...stats19Sample, id: "stats-19-storybook" },
};
