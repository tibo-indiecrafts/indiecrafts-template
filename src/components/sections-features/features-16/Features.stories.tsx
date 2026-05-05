import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features16Section } from "./index";
import { features16Sample } from "./config";

const meta: Meta<typeof Features16Section> = {
  title: "Sections/Features/Features16",
  component: Features16Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features16Section>;

export const Default: Story = {
  args: { ...features16Sample, id: "story-features-16" } as React.ComponentProps<
    typeof Features16Section
  >,
};
