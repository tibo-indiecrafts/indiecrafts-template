import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features5Section } from "./index";
import { features5Sample } from "./config";

const meta: Meta<typeof Features5Section> = {
  title: "Sections/Marketing/Features/Features5",
  component: Features5Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features5Section>;

export const Default: Story = {
  args: { ...features5Sample, id: "story-features-5" } as React.ComponentProps<
    typeof Features5Section
  >,
};
