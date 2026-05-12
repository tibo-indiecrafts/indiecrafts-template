import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorks08Section } from "./index";
import { howItWorks08Sample } from "./config";

const meta: Meta<typeof HowItWorks08Section> = {
  title: "Sections/HowItWorks/HowItWorks08",
  component: HowItWorks08Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HowItWorks08Section>;

export const Default: Story = {
  args: { ...howItWorks08Sample, id: "story-how-it-works-08" } as React.ComponentProps<
    typeof HowItWorks08Section
  >,
};
