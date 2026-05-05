import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorks2Section } from "./index";
import { howItWorks2Sample } from "./config";

const meta: Meta<typeof HowItWorks2Section> = {
  title: "Sections/HowItWorks/HowItWorks2",
  component: HowItWorks2Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HowItWorks2Section>;

export const Default: Story = {
  args: {
    ...howItWorks2Sample,
    id: "story-how-it-works-2",
  } as React.ComponentProps<typeof HowItWorks2Section>,
};
