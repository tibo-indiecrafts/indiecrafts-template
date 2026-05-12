import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaceScan2Illustration } from "./face-scan-2";

const meta: Meta<typeof FaceScan2Illustration> = {
  title: "UI Illustrations/Face Scan 2",
  component: FaceScan2Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof FaceScan2Illustration>;
export const Default: Story = {};
