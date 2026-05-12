import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MobileWalletLineIllustration } from "./mobile-wallet-line";

const meta: Meta<typeof MobileWalletLineIllustration> = {
  title: "UI Illustrations/Mobile Wallet Line",
  component: MobileWalletLineIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MobileWalletLineIllustration>;
export const Default: Story = {};
