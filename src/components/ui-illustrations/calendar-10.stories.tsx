import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar10Illustration } from "./calendar-10";

const meta: Meta<typeof Calendar10Illustration> = {
  title: "UI Illustrations/Calendar 10",
  component: Calendar10Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Calendar10Illustration>;
export const Default: Story = {};
