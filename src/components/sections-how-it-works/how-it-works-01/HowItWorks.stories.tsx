import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorks01Section } from "./index";
import { howItWorks01Sample } from "./config";

const meta: Meta<typeof HowItWorks01Section> = {
  title: "Sections/HowItWorks/HowItWorks01",
  component: HowItWorks01Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HowItWorks01Section>;

export const Default: Story = {
  args: {
    ...howItWorks01Sample,
    id: "story-how-it-works-01",
  } as React.ComponentProps<typeof HowItWorks01Section>,
};
