import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SecurityAuditIllustration } from "./grid-2-solution-security-shield";

const meta: Meta<typeof SecurityAuditIllustration> = {
  title: "UI Illustrations/Grid 2 Solution Security Shield",
  component: SecurityAuditIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof SecurityAuditIllustration>;
export const Default: Story = {};
