import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Team01Section } from "./index";
import { team01Sample } from "./config";

const meta: Meta<typeof Team01Section> = {
  title: "Sections/Team/Team01",
  component: Team01Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Team01Section>;

export const Default: Story = {
  args: { ...team01Sample, id: "story-team-01" } as React.ComponentProps<
    typeof Team01Section
  >,
};
