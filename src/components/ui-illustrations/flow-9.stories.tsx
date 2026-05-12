import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Flow9Illustration } from "./flow-9";

const meta: Meta<typeof Flow9Illustration> = {
  title: "UI Illustrations/Flow 9",
  component: Flow9Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Flow9Illustration>;
export const Default: Story = {};
