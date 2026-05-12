import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Flow8Illustration } from "./flow-8";

const meta: Meta<typeof Flow8Illustration> = {
  title: "UI Illustrations/Flow 8",
  component: Flow8Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Flow8Illustration>;
export const Default: Story = {};
