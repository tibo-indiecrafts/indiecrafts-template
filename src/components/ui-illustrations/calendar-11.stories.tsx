import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar11Illustration } from "./calendar-11";

const meta: Meta<typeof Calendar11Illustration> = {
  title: "UI Illustrations/Calendar 11",
  component: Calendar11Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Calendar11Illustration>;
export const Default: Story = {};
