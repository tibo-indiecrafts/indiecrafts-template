import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Stats1Section } from "./index";
import { stats1Sample } from "./config";

const meta: Meta<typeof Stats1Section> = {
  title: "Sections/Marketing/Stats/Stats1",
  component: Stats1Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Stats1Section>;

export const Default: Story = {
  args: { ...stats1Sample, id: "story-stats-1" } as React.ComponentProps<
    typeof Stats1Section
  >,
};
