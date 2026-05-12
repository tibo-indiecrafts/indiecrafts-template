import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar4Illustration } from "./calendar-4";

const meta: Meta<typeof Calendar4Illustration> = {
  title: "UI Illustrations/Calendar 4",
  component: Calendar4Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Calendar4Illustration>;
export const Default: Story = {};
