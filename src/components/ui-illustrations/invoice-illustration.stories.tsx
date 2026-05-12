import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InvoiceIllustration } from "./invoice-illustration";

const meta: Meta<typeof InvoiceIllustration> = {
  title: "UI Illustrations/Invoice",
  component: InvoiceIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof InvoiceIllustration>;

export const Default: Story = {};
