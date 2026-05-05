import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorks7Section } from "./index";
import { howItWorks7Sample } from "./config";

const meta: Meta<typeof HowItWorks7Section> = {
  title: "Sections/HowItWorks/HowItWorks7",
  component: HowItWorks7Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HowItWorks7Section>;

export const Default: Story = {
  args: {
    ...howItWorks7Sample,
    id: "story-how-it-works-7",
  } as React.ComponentProps<typeof HowItWorks7Section>,
};
