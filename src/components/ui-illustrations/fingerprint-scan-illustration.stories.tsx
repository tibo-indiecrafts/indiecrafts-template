import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FingerprintScanIllustration } from "./fingerprint-scan-illustration";

const meta: Meta<typeof FingerprintScanIllustration> = {
  title: "UI Illustrations/FingerprintScanIllustration",
  component: FingerprintScanIllustration,
  parameters: { layout: "centered", backgrounds: { default: "dark" } },
};
export default meta;

type Story = StoryObj<typeof FingerprintScanIllustration>;

export const Default: Story = {};
