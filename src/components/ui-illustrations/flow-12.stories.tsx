import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Flow12Illustration } from "./flow-12";

const meta: Meta<typeof Flow12Illustration> = {
  title: "UI Illustrations/Flow 12",
  component: Flow12Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Flow12Illustration>;
export const Default: Story = {};
