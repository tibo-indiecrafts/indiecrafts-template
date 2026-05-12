import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar8Illustration } from "./calendar-8";

const meta: Meta<typeof Calendar8Illustration> = {
  title: "UI Illustrations/Calendar 8",
  component: Calendar8Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Calendar8Illustration>;
export const Default: Story = {};
