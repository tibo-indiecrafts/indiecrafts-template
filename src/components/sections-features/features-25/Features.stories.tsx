import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features25Section } from "./index";
import { features25Sample } from "./config";

const meta: Meta<typeof Features25Section> = {
  title: "Sections/Features/Features25",
  component: Features25Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features25Section>;

export const Default: Story = {
  args: { ...features25Sample, id: "story-features-25" } as React.ComponentProps<
    typeof Features25Section
  >,
};
