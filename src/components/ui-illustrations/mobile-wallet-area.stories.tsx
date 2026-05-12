import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MobileWalletAreaIllustration } from "./mobile-wallet-area";

const meta: Meta<typeof MobileWalletAreaIllustration> = {
  title: "UI Illustrations/Mobile Wallet Area",
  component: MobileWalletAreaIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MobileWalletAreaIllustration>;
export const Default: Story = {};
