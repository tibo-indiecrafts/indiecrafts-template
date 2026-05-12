import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Flow2Illustration } from "./grid-2-product-flow-2-illustration";

const meta: Meta<typeof Flow2Illustration> = {
  title: "UI Illustrations/Grid 2 Product Flow 2",
  component: Flow2Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Flow2Illustration>;
export const Default: Story = {};
