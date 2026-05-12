import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar2Illustration } from "./calendar-2";

const meta: Meta<typeof Calendar2Illustration> = {
  title: "UI Illustrations/Calendar 2",
  component: Calendar2Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Calendar2Illustration>;
export const Default: Story = {};
