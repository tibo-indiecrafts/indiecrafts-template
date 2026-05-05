import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProductTabs } from "./product-tabs";

const meta: Meta<typeof ProductTabs> = {
  title: "UI Illustrations/ProductTabs",
  component: ProductTabs,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ProductTabs>;

export const Default: Story = {};
