import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CurrencyIllustration } from "./libre-landing-currency-illustration";

const meta: Meta<typeof CurrencyIllustration> = {
  title: "UI Illustrations/Libre Landing Currency",
  component: CurrencyIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CurrencyIllustration>;
export const Default: Story = {};
