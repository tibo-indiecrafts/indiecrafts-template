import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorks04Section } from "./index";
import { howItWorks04Sample } from "./config";

const meta: Meta<typeof HowItWorks04Section> = {
  title: "Sections/HowItWorks/HowItWorks04",
  component: HowItWorks04Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HowItWorks04Section>;

export const Default: Story = {
  args: {
    ...howItWorks04Sample,
    id: "story-how-it-works-04",
  } as React.ComponentProps<typeof HowItWorks04Section>,
};
