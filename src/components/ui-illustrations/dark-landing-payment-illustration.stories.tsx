import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PaymentIllustration } from "./dark-landing-payment-illustration";

const meta: Meta<typeof PaymentIllustration> = {
  title: "UI Illustrations/Dark Landing Payment",
  component: PaymentIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof PaymentIllustration>;
export const Default: Story = {};
