import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InvoiceCardIllustration } from "./invoice-card-illustration";

const meta: Meta<typeof InvoiceCardIllustration> = {
  title: "UI Illustrations/InvoiceCardIllustration",
  component: InvoiceCardIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof InvoiceCardIllustration>;

export const Default: Story = {};
