import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProductStacked } from "./product-stacked";

const meta: Meta<typeof ProductStacked> = {
  title: "UI Illustrations/ProductStacked",
  component: ProductStacked,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ProductStacked>;

export const Default: Story = {};
