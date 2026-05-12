import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Stats16Section } from "./index";
import { stats16Sample } from "./config";

const meta: Meta<typeof Stats16Section> = {
  title: "Sections/Stats/Stats16",
  component: Stats16Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Stats16Section>;

export const Default: Story = {
  args: { ...stats16Sample, id: "story-stats-16" } as React.ComponentProps<
    typeof Stats16Section
  >,
};
