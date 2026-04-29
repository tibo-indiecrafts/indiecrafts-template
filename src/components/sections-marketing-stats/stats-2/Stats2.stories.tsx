import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Stats2Section } from "./index";
import { stats2Sample } from "./config";

const meta: Meta<typeof Stats2Section> = {
  title: "Sections/Marketing/Stats/Stats2",
  component: Stats2Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Stats2Section>;

export const Default: Story = {
  args: { ...stats2Sample, id: "story-stats-2" } as React.ComponentProps<
    typeof Stats2Section
  >,
};
