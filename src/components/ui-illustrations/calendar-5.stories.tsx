import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar5Illustration } from "./calendar-5";

const meta: Meta<typeof Calendar5Illustration> = {
  title: "UI Illustrations/Calendar 5",
  component: Calendar5Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Calendar5Illustration>;
export const Default: Story = {};
