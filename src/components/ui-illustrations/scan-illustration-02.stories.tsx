import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScanIllustration } from "./scan-illustration-02";

const meta: Meta<typeof ScanIllustration> = {
  title: "UI Illustrations/Grid 2 Landing Scan",
  component: ScanIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ScanIllustration>;
export const Default: Story = {};
