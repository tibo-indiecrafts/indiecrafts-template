import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features10Section } from "./index";
import { features10Sample } from "./config";

const meta: Meta<typeof Features10Section> = {
  title: "Sections/Features/Features10",
  component: Features10Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features10Section>;

export const Default: Story = {
  args: { ...features10Sample, id: "story-features-10" } as React.ComponentProps<
    typeof Features10Section
  >,
};
