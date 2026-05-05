import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CreditCard } from "./credit-card";

const meta: Meta<typeof CreditCard> = {
  title: "UI Illustrations/CreditCard",
  component: CreditCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CreditCard>;

export const Default: Story = {};
