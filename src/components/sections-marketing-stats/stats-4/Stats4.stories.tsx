import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Stats4Section } from "./index";
import { stats4Sample } from "./config";

const meta: Meta<typeof Stats4Section> = {
  title: "Sections/Marketing/Stats/Stats4",
  component: Stats4Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Stats4Section>;

export const Default: Story = {
  args: { ...stats4Sample, id: "story-stats-4" } as React.ComponentProps<
    typeof Stats4Section
  >,
};
