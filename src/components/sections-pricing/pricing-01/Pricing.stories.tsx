import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pricing01Section } from "./index";
import { pricing01Sample } from "./config";

const meta: Meta<typeof Pricing01Section> = {
  title: "Sections/Pricing/Pricing01",
  component: Pricing01Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Pricing01Section>;

export const Default: Story = {
  args: { ...pricing01Sample, id: "story-pricing-01" } as React.ComponentProps<
    typeof Pricing01Section
  >,
};
