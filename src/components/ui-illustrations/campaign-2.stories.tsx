import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Campaign2Illustration } from "./campaign-2";

const meta: Meta<typeof Campaign2Illustration> = {
  title: "UI Illustrations/Campaign 2",
  component: Campaign2Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Campaign2Illustration>;
export const Default: Story = {};
