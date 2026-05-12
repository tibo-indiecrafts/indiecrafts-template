import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Team from "./Team";
import { team04Sample } from "./config";

const meta: Meta<typeof Team> = {
  title: "Sections/Team/Team04",
  component: Team,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Team>;

export const Default: Story = {
  args: { ...team04Sample, id: "team-04-storybook" },
};
