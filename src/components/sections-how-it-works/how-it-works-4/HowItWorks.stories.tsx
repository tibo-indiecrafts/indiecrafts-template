import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorks4Section } from "./index";
import { howItWorks4Sample } from "./config";

const meta: Meta<typeof HowItWorks4Section> = {
  title: "Sections/HowItWorks/HowItWorks4",
  component: HowItWorks4Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HowItWorks4Section>;

export const Default: Story = {
  args: {
    ...howItWorks4Sample,
    id: "story-how-it-works-4",
  } as React.ComponentProps<typeof HowItWorks4Section>,
};
