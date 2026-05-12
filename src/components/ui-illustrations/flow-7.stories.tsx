import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Flow7Illustration } from "./flow-7";

const meta: Meta<typeof Flow7Illustration> = {
  title: "UI Illustrations/Flow 7",
  component: Flow7Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Flow7Illustration>;
export const Default: Story = {};
