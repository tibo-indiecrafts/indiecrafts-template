import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LinkPaymentIllustration } from "./link-payment-illustration-02";

const meta: Meta<typeof LinkPaymentIllustration> = {
  title: "UI Illustrations/Libre Landing Two Link Payment",
  component: LinkPaymentIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof LinkPaymentIllustration>;
export const Default: Story = {};
