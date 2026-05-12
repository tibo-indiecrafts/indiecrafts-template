import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorks06Section } from "./index";
import { howItWorks06Sample } from "./config";

const meta: Meta<typeof HowItWorks06Section> = {
  title: "Sections/HowItWorks/HowItWorks06",
  component: HowItWorks06Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HowItWorks06Section>;

export const Default: Story = {
  args: {
    ...howItWorks06Sample,
    id: "story-how-it-works-06",
  } as React.ComponentProps<typeof HowItWorks06Section>,
};
