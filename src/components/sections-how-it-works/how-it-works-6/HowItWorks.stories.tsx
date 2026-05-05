import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorks6Section } from "./index";
import { howItWorks6Sample } from "./config";

const meta: Meta<typeof HowItWorks6Section> = {
  title: "Sections/HowItWorks/HowItWorks6",
  component: HowItWorks6Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HowItWorks6Section>;

export const Default: Story = {
  args: {
    ...howItWorks6Sample,
    id: "story-how-it-works-6",
  } as React.ComponentProps<typeof HowItWorks6Section>,
};
