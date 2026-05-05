import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BillingCheckout } from "./billing-checkout";

const meta: Meta<typeof BillingCheckout> = {
  title: "UI Illustrations/BillingCheckout",
  component: BillingCheckout,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof BillingCheckout>;

export const Default: Story = {};
