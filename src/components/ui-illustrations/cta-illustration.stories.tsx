import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CtaIllustration } from "./cta-illustration";

const meta: Meta<typeof CtaIllustration> = {
  title: "UI Illustrations/Libre Customers One Cta",
  component: CtaIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CtaIllustration>;
export const Default: Story = {};
