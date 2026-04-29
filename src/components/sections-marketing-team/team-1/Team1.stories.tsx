import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Team1Section } from "./index";
import { team1Sample } from "./config";

const meta: Meta<typeof Team1Section> = {
  title: "Sections/Marketing/Team/Team1",
  component: Team1Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Team1Section>;

export const Default: Story = {
  args: { ...team1Sample, id: "story-team-1" } as React.ComponentProps<
    typeof Team1Section
  >,
};
