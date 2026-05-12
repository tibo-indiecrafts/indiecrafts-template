import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Poll2Illustration } from "./poll-2";

const meta: Meta<typeof Poll2Illustration> = {
  title: "UI Illustrations/Poll 2",
  component: Poll2Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Poll2Illustration>;
export const Default: Story = {};
