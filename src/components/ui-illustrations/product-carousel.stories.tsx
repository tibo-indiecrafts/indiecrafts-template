import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProductCarousel } from "./product-carousel";

const meta: Meta<typeof ProductCarousel> = {
  title: "UI Illustrations/ProductCarousel",
  component: ProductCarousel,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ProductCarousel>;

export const Default: Story = {};
