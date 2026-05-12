import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features28Section } from "./index";
import { features28Sample } from "./config";

const meta: Meta<typeof Features28Section> = {
  title: "Sections/Features/Features28",
  component: Features28Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features28Section>;

export const Default: Story = {
  args: { ...features28Sample, id: "story-features-28" } as React.ComponentProps<
    typeof Features28Section
  >,
};
