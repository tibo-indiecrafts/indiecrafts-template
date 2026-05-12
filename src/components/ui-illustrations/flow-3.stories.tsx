import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Flow3Illustration } from "./flow-3";

const meta: Meta<typeof Flow3Illustration> = {
  title: "UI Illustrations/Flow 3",
  component: Flow3Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Flow3Illustration>;
export const Default: Story = {};
