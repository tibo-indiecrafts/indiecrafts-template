import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features12Section } from "./index";
import { features12Sample } from "./config";

const meta: Meta<typeof Features12Section> = {
  title: "Sections/Features/Features12",
  component: Features12Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features12Section>;

export const Default: Story = {
  args: { ...features12Sample, id: "story-features-12" } as React.ComponentProps<
    typeof Features12Section
  >,
};
