import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Flow13Illustration } from "./flow-13";

const meta: Meta<typeof Flow13Illustration> = {
  title: "UI Illustrations/Flow 13",
  component: Flow13Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Flow13Illustration>;
export const Default: Story = {};
