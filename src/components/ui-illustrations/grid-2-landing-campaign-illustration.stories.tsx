import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CampaignIllustration } from "./grid-2-landing-campaign-illustration";

const meta: Meta<typeof CampaignIllustration> = {
  title: "UI Illustrations/Grid 2 Landing Campaign",
  component: CampaignIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CampaignIllustration>;
export const Default: Story = {};
