import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features11Section } from "./index";
import { features11Sample } from "./config";

const meta: Meta<typeof Features11Section> = {
  title: "Sections/Marketing/Features/Features11",
  component: Features11Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features11Section>;

export const Default: Story = {
  args: { ...features11Sample, id: "story-features-11" } as React.ComponentProps<
    typeof Features11Section
  >,
};
