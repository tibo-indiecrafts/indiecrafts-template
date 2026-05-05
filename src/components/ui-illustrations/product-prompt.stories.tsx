import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProductPrompt } from "./product-prompt";

const meta: Meta<typeof ProductPrompt> = {
  title: "UI Illustrations/ProductPrompt",
  component: ProductPrompt,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ProductPrompt>;

export const Default: Story = {};
