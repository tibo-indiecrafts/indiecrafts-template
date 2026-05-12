import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CallToAction from "./CallToAction";
import { cta09Sample } from "./config";

const meta: Meta<typeof CallToAction> = {
  title: "Sections/Cta/Cta09",
  component: CallToAction,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CallToAction>;

export const Default: Story = {
  args: { ...cta09Sample, id: "cta-09-storybook" },
};
