import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorks02Section } from "./index";
import { howItWorks02Sample } from "./config";

const meta: Meta<typeof HowItWorks02Section> = {
  title: "Sections/HowItWorks/HowItWorks02",
  component: HowItWorks02Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HowItWorks02Section>;

export const Default: Story = {
  args: {
    ...howItWorks02Sample,
    id: "story-how-it-works-02",
  } as React.ComponentProps<typeof HowItWorks02Section>,
};
