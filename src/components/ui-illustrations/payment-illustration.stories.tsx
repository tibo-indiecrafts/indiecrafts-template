import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PaymentIllustration } from "./payment-illustration";

const meta: Meta<typeof PaymentIllustration> = {
  title: "UI Illustrations/PaymentIllustration",
  component: PaymentIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof PaymentIllustration>;

export const Default: Story = {};
