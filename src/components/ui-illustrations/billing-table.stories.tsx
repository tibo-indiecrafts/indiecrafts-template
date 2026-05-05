import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BillingTable } from "./billing-table";

const meta: Meta<typeof BillingTable> = {
  title: "UI Illustrations/BillingTable",
  component: BillingTable,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof BillingTable>;

export const Default: Story = {};
