import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorks5Section } from "./index";
import { howItWorks5Sample } from "./config";

const meta: Meta<typeof HowItWorks5Section> = {
  title: "Sections/HowItWorks/HowItWorks5",
  component: HowItWorks5Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HowItWorks5Section>;

export const Default: Story = {
  args: {
    ...howItWorks5Sample,
    id: "story-how-it-works-5",
  } as React.ComponentProps<typeof HowItWorks5Section>,
};
