import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FingerprintIllustration } from "./fingerprint";

const meta: Meta<typeof FingerprintIllustration> = {
  title: "UI Illustrations/Fingerprint",
  component: FingerprintIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof FingerprintIllustration>;
export const Default: Story = {};
