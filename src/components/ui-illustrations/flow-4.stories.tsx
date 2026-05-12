import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Flow4Illustration } from "./flow-4";

const meta: Meta<typeof Flow4Illustration> = {
  title: "UI Illustrations/Flow 4",
  component: Flow4Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Flow4Illustration>;
export const Default: Story = {};
