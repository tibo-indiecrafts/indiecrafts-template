import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features24Section } from "./index";
import { features24Sample } from "./config";

const meta: Meta<typeof Features24Section> = {
  title: "Sections/Features/Features24",
  component: Features24Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features24Section>;

export const Default: Story = {
  args: { ...features24Sample, id: "story-features-24" } as React.ComponentProps<
    typeof Features24Section
  >,
};
