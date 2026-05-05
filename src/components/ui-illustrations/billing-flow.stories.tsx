import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BillingFlow } from "./billing-flow";

const meta: Meta<typeof BillingFlow> = {
  title: "UI Illustrations/BillingFlow",
  component: BillingFlow,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof BillingFlow>;

export const Default: Story = {};
