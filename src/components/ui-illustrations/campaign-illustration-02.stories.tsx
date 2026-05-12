import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CampaignIllustration } from "./campaign-illustration-02";

const meta: Meta<typeof CampaignIllustration> = {
  title: "UI Illustrations/Grid 2 Landing Campaign",
  component: CampaignIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CampaignIllustration>;
export const Default: Story = {};
