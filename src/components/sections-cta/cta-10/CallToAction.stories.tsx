import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CallToAction from "./CallToAction";
import { cta10Sample } from "./config";

const meta: Meta<typeof CallToAction> = {
  title: "Sections/Cta/Cta10",
  component: CallToAction,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CallToAction>;

export const Default: Story = {
  args: { ...cta10Sample, id: "cta-10-storybook" },
};
