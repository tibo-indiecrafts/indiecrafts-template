import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Stats3Section } from "./index";
import { stats3Sample } from "./config";

const meta: Meta<typeof Stats3Section> = {
  title: "Sections/Marketing/Stats/Stats3",
  component: Stats3Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Stats3Section>;

export const Default: Story = {
  args: { ...stats3Sample, id: "story-stats-3" } as React.ComponentProps<
    typeof Stats3Section
  >,
};
