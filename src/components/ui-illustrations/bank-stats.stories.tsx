import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BankStatsIllustration } from "./bank-stats";

const meta: Meta<typeof BankStatsIllustration> = {
  title: "UI Illustrations/Bank Stats",
  component: BankStatsIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof BankStatsIllustration>;
export const Default: Story = {};
