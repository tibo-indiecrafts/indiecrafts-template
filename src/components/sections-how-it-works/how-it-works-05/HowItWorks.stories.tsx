import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorks05Section } from "./index";
import { howItWorks05Sample } from "./config";

const meta: Meta<typeof HowItWorks05Section> = {
  title: "Sections/HowItWorks/HowItWorks05",
  component: HowItWorks05Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HowItWorks05Section>;

export const Default: Story = {
  args: {
    ...howItWorks05Sample,
    id: "story-how-it-works-05",
  } as React.ComponentProps<typeof HowItWorks05Section>,
};
