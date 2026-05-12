import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorks07Section } from "./index";
import { howItWorks07Sample } from "./config";

const meta: Meta<typeof HowItWorks07Section> = {
  title: "Sections/HowItWorks/HowItWorks07",
  component: HowItWorks07Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HowItWorks07Section>;

export const Default: Story = {
  args: {
    ...howItWorks07Sample,
    id: "story-how-it-works-07",
  } as React.ComponentProps<typeof HowItWorks07Section>,
};
