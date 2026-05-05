import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features19Section } from "./index";
import { features19Sample } from "./config";

const meta: Meta<typeof Features19Section> = {
  title: "Sections/Features/Features19",
  component: Features19Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features19Section>;

export const Default: Story = {
  args: { ...features19Sample, id: "story-features-19" } as React.ComponentProps<
    typeof Features19Section
  >,
};
