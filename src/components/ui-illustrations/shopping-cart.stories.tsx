import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ShoppingCartIllustration } from "./shopping-cart";

const meta: Meta<typeof ShoppingCartIllustration> = {
  title: "UI Illustrations/Shopping Cart",
  component: ShoppingCartIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ShoppingCartIllustration>;
export const Default: Story = {};
