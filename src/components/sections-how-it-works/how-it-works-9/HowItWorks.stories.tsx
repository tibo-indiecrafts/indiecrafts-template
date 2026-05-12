import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorks9Section } from "./index";
import { howItWorks9Sample } from "./config";

const meta: Meta<typeof HowItWorks9Section> = {
  title: "Sections/HowItWorks/HowItWorks9",
  component: HowItWorks9Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HowItWorks9Section>;
export const Default: Story = {
  args: { ...howItWorks9Sample, id: "story-how-it-works-9" } as React.ComponentProps<
    typeof HowItWorks9Section
  >,
};
