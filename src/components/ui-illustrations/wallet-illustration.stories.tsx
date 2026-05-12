import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WalletIllustration } from "./wallet-illustration";

const meta: Meta<typeof WalletIllustration> = {
  title: "UI Illustrations/Grid 2 Product Wallet",
  component: WalletIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof WalletIllustration>;
export const Default: Story = {};
