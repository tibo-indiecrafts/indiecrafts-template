import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Flow10Illustration } from "./flow-10";

const meta: Meta<typeof Flow10Illustration> = {
  title: "UI Illustrations/Flow 10",
  component: Flow10Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Flow10Illustration>;
export const Default: Story = {};
