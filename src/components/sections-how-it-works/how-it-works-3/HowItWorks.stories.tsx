import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorks3Section } from "./index";
import { howItWorks3Sample } from "./config";

const meta: Meta<typeof HowItWorks3Section> = {
  title: "Sections/HowItWorks/HowItWorks3",
  component: HowItWorks3Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HowItWorks3Section>;

export const Default: Story = {
  args: {
    ...howItWorks3Sample,
    id: "story-how-it-works-3",
  } as React.ComponentProps<typeof HowItWorks3Section>,
};
