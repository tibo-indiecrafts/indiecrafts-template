import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Flow11Illustration } from "./flow-11";

const meta: Meta<typeof Flow11Illustration> = {
  title: "UI Illustrations/Flow 11",
  component: Flow11Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Flow11Illustration>;
export const Default: Story = {};
