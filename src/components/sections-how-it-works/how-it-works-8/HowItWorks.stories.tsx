import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorks8Section } from "./index";
import { howItWorks8Sample } from "./config";

const meta: Meta<typeof HowItWorks8Section> = {
  title: "Sections/HowItWorks/HowItWorks8",
  component: HowItWorks8Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HowItWorks8Section>;

export const Default: Story = {
  args: { ...howItWorks8Sample, id: "story-how-it-works-8" } as React.ComponentProps<
    typeof HowItWorks8Section
  >,
};
