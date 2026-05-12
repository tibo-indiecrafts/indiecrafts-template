import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar3Illustration } from "./calendar-3";

const meta: Meta<typeof Calendar3Illustration> = {
  title: "UI Illustrations/Calendar 3",
  component: Calendar3Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Calendar3Illustration>;
export const Default: Story = {};
