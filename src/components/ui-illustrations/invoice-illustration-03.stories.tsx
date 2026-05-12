import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InvoiceIllustration } from "./invoice-illustration-03";

const meta: Meta<typeof InvoiceIllustration> = {
  title: "UI Illustrations/Grid 1 Landing Invoice",
  component: InvoiceIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof InvoiceIllustration>;
export const Default: Story = {};
