import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecurityShieldIsoIllustration } from "./security-shield-iso-illustration";

const meta: Meta<typeof SecurityShieldIsoIllustration> = {
  title: "UI Illustrations/SecurityShieldIsoIllustration",
  component: SecurityShieldIsoIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof SecurityShieldIsoIllustration>;

export const Default: Story = {};
