import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScanIllustration } from "./scan-illustration";

const meta: Meta<typeof ScanIllustration> = {
  title: "UI Illustrations/Scan",
  component: ScanIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ScanIllustration>;

export const Default: Story = {};
