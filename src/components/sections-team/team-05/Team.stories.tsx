import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Team from "./Team";
import { team05Sample } from "./config";

const meta: Meta<typeof Team> = {
  title: "Sections/Team/Team05",
  component: Team,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Team>;

export const Default: Story = {
  args: { ...team05Sample, id: "team-05-storybook" },
};
