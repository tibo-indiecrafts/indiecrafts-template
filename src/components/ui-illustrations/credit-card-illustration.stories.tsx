import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CreditCardIllustration } from "./credit-card-illustration";

const meta: Meta<typeof CreditCardIllustration> = {
  title: "UI Illustrations/Grid 2 Landing Credit Card",
  component: CreditCardIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CreditCardIllustration>;
export const Default: Story = {};
