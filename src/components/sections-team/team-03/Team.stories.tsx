import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Team from "./Team";
import { team03Sample } from "./config";

const meta: Meta<typeof Team> = {
  title: "Sections/Team/Team03",
  component: Team,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Team>;

export const Default: Story = {
  args: { ...team03Sample, id: "team-03-storybook" },
};
