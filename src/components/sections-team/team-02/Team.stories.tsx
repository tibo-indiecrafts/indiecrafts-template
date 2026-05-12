import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Team from "./Team";
import { team02Sample } from "./config";

const meta: Meta<typeof Team> = {
  title: "Sections/Team/Team02",
  component: Team,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Team>;

export const Default: Story = {
  args: { ...team02Sample, id: "team-02-storybook" },
};
