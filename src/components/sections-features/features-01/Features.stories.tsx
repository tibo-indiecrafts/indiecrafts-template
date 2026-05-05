import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features01Section } from "./index";
import { features01Sample } from "./config";

const meta: Meta<typeof Features01Section> = {
  title: "Sections/Features/Features01",
  component: Features01Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features01Section>;

export const Default: Story = {
  args: { ...features01Sample, id: "story-features-01" } as React.ComponentProps<
    typeof Features01Section
  >,
};
