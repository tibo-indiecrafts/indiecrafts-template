import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features4Section } from "./index";
import { features4Sample } from "./config";

const meta: Meta<typeof Features4Section> = {
  title: "Sections/Marketing/Features/Features4",
  component: Features4Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features4Section>;

export const Default: Story = {
  args: { ...features4Sample, id: "story-features-4" } as React.ComponentProps<
    typeof Features4Section
  >,
};
