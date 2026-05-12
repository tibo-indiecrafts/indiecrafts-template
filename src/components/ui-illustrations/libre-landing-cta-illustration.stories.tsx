import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CtaIllustration } from "./libre-landing-cta-illustration";

const meta: Meta<typeof CtaIllustration> = {
  title: "UI Illustrations/Libre Landing Cta",
  component: CtaIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CtaIllustration>;
export const Default: Story = {};
