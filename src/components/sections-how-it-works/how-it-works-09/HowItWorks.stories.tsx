import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorks09Section } from "./index";
import { howItWorks09Sample } from "./config";

const meta: Meta<typeof HowItWorks09Section> = {
  title: "Sections/HowItWorks/HowItWorks09",
  component: HowItWorks09Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HowItWorks09Section>;
export const Default: Story = {
  args: { ...howItWorks09Sample, id: "story-how-it-works-09" } as React.ComponentProps<
    typeof HowItWorks09Section
  >,
};
