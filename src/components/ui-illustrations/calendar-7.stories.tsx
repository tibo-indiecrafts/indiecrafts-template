import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar7Illustration } from "./calendar-7";

const meta: Meta<typeof Calendar7Illustration> = {
  title: "UI Illustrations/Calendar 7",
  component: Calendar7Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Calendar7Illustration>;
export const Default: Story = {};
