import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProductIllustration } from "./product-illustration";

const meta: Meta<typeof ProductIllustration> = {
  title: "UI Illustrations/Product",
  component: ProductIllustration,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ProductIllustration>;

export const Default: Story = {};
