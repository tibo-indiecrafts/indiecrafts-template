import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar10Illustration } from "./grid-2-product-calendar-10-illustration";

const meta: Meta<typeof Calendar10Illustration> = {
  title: "UI Illustrations/Grid 2 Product Calendar 10",
  component: Calendar10Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Calendar10Illustration>;
export const Default: Story = {};
