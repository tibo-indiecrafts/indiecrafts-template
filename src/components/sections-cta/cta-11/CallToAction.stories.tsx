import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CallToAction from "./CallToAction";
import { cta11Sample } from "./config";

const meta: Meta<typeof CallToAction> = {
  title: "Sections/Cta/Cta11",
  component: CallToAction,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CallToAction>;

export const Default: Story = {
  args: { ...cta11Sample, id: "cta-11-storybook" },
};
