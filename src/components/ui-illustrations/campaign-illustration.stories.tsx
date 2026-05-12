import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CampaignIllustration } from "./campaign-illustration";

const meta: Meta<typeof CampaignIllustration> = {
  title: "UI Illustrations/Campaign",
  component: CampaignIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CampaignIllustration>;

export const Default: Story = {};
