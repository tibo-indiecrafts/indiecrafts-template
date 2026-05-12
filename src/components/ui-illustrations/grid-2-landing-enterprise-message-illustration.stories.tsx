import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EnterpriseMessageIllustration } from "./grid-2-landing-enterprise-message-illustration";

const meta: Meta<typeof EnterpriseMessageIllustration> = {
  title: "UI Illustrations/Grid 2 Landing Enterprise Message",
  component: EnterpriseMessageIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof EnterpriseMessageIllustration>;
export const Default: Story = {};
