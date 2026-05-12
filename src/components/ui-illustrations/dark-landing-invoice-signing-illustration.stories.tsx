import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InvoiceSigningIllustration } from "./dark-landing-invoice-signing-illustration";

const meta: Meta<typeof InvoiceSigningIllustration> = {
  title: "UI Illustrations/Dark Landing Invoice Signing",
  component: InvoiceSigningIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof InvoiceSigningIllustration>;
export const Default: Story = {};
