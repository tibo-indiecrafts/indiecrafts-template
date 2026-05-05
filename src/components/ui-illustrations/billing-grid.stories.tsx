import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BillingGrid } from "./billing-grid";

const meta: Meta<typeof BillingGrid> = {
  title: "UI Illustrations/BillingGrid",
  component: BillingGrid,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof BillingGrid>;

export const Default: Story = {};
