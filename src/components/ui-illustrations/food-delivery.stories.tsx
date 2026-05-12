import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FoodDeliveryIllustration } from "./food-delivery";

const meta: Meta<typeof FoodDeliveryIllustration> = {
  title: "UI Illustrations/Food Delivery",
  component: FoodDeliveryIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof FoodDeliveryIllustration>;
export const Default: Story = {};
