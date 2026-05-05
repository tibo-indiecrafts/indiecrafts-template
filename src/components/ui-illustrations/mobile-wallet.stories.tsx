import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MobileWalletIllustration } from "./mobile-wallet";

const meta: Meta<typeof MobileWalletIllustration> = {
  title: "UI Illustrations/MobileWallet",
  component: MobileWalletIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MobileWalletIllustration>;

export const Default: Story = {};
