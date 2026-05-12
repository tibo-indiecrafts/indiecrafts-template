import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaceScanIllustration } from "./face-scan";

const meta: Meta<typeof FaceScanIllustration> = {
  title: "UI Illustrations/Face Scan",
  component: FaceScanIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof FaceScanIllustration>;
export const Default: Story = {};
