import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CompletePaymentIllustration } from "./dark-landing-complete-payment-illustration";

const meta: Meta<typeof CompletePaymentIllustration> = {
  title: "UI Illustrations/Dark Landing Complete Payment",
  component: CompletePaymentIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CompletePaymentIllustration>;
export const Default: Story = {};
