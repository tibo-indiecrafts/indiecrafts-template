import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar6Illustration } from "./calendar-6";

const meta: Meta<typeof Calendar6Illustration> = {
  title: "UI Illustrations/Calendar 6",
  component: Calendar6Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Calendar6Illustration>;
export const Default: Story = {};
