import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features18Section } from "./index";
import { features18Sample } from "./config";

const meta: Meta<typeof Features18Section> = {
  title: "Sections/Features/Features18",
  component: Features18Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features18Section>;

export const Default: Story = {
  args: { ...features18Sample, id: "story-features-18" } as React.ComponentProps<
    typeof Features18Section
  >,
};
