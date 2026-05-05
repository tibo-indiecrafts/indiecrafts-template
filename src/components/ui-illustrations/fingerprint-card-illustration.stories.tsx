import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FingerprintCardIllustration } from "./fingerprint-card-illustration";

const meta: Meta<typeof FingerprintCardIllustration> = {
  title: "UI Illustrations/FingerprintCardIllustration",
  component: FingerprintCardIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof FingerprintCardIllustration>;

export const Default: Story = {};
