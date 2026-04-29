import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features1Section } from "./index";
import { features1Sample } from "./config";

const meta: Meta<typeof Features1Section> = {
  title: "Sections/Marketing/Features/Features1",
  component: Features1Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features1Section>;

export const Default: Story = {
  args: { ...features1Sample, id: "story-features-1" } as React.ComponentProps<
    typeof Features1Section
  >,
};
