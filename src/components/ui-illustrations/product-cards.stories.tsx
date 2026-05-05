import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProductCards } from "./product-cards";

const meta: Meta<typeof ProductCards> = {
  title: "UI Illustrations/ProductCards",
  component: ProductCards,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ProductCards>;

export const Default: Story = {};
