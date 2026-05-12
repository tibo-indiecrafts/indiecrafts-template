import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorks03Section } from "./index";
import { howItWorks03Sample } from "./config";

const meta: Meta<typeof HowItWorks03Section> = {
  title: "Sections/HowItWorks/HowItWorks03",
  component: HowItWorks03Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HowItWorks03Section>;

export const Default: Story = {
  args: {
    ...howItWorks03Sample,
    id: "story-how-it-works-03",
  } as React.ComponentProps<typeof HowItWorks03Section>,
};
