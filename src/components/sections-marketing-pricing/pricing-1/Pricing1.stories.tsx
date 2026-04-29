import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pricing1Section } from "./index";
import { pricing1Sample } from "./config";

const meta: Meta<typeof Pricing1Section> = {
  title: "Sections/Marketing/Pricing/Pricing1",
  component: Pricing1Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Pricing1Section>;

export const Default: Story = {
  args: { ...pricing1Sample, id: "story-pricing-1" } as React.ComponentProps<
    typeof Pricing1Section
  >,
};
