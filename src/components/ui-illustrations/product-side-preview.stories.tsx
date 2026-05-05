import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProductSidePreview } from "./product-side-preview";

const meta: Meta<typeof ProductSidePreview> = {
  title: "UI Illustrations/ProductSidePreview",
  component: ProductSidePreview,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ProductSidePreview>;

export const Default: Story = {};
