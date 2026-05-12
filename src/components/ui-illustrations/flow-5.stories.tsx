import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Flow5Illustration } from "./flow-5";

const meta: Meta<typeof Flow5Illustration> = {
  title: "UI Illustrations/Flow 5",
  component: Flow5Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Flow5Illustration>;
export const Default: Story = {};
