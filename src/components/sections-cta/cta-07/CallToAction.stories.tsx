import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CallToAction from "./CallToAction";
import { cta07Sample } from "./config";

const meta: Meta<typeof CallToAction> = {
  title: "Sections/Cta/Cta07",
  component: CallToAction,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CallToAction>;

export const Default: Story = {
  args: { ...cta07Sample, id: "cta-07-storybook" },
};
