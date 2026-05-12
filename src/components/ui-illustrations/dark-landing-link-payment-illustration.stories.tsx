import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LinkPaymentIllustration } from "./dark-landing-link-payment-illustration";

const meta: Meta<typeof LinkPaymentIllustration> = {
  title: "UI Illustrations/Dark Landing Link Payment",
  component: LinkPaymentIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof LinkPaymentIllustration>;
export const Default: Story = {};
