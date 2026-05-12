import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CallToAction from "./CallToAction";
import { cta08Sample } from "./config";

const meta: Meta<typeof CallToAction> = {
  title: "Sections/Cta/Cta08",
  component: CallToAction,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CallToAction>;

export const Default: Story = {
  args: { ...cta08Sample, id: "cta-08-storybook" },
};
