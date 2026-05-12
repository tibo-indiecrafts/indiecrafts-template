import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Flow6Illustration } from "./flow-6";

const meta: Meta<typeof Flow6Illustration> = {
  title: "UI Illustrations/Flow 6",
  component: Flow6Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Flow6Illustration>;
export const Default: Story = {};
