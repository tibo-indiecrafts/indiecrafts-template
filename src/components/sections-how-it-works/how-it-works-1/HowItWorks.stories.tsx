import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorks1Section } from "./index";
import { howItWorks1Sample } from "./config";

const meta: Meta<typeof HowItWorks1Section> = {
  title: "Sections/HowItWorks/HowItWorks1",
  component: HowItWorks1Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HowItWorks1Section>;

export const Default: Story = {
  args: {
    ...howItWorks1Sample,
    id: "story-how-it-works-1",
  } as React.ComponentProps<typeof HowItWorks1Section>,
};
