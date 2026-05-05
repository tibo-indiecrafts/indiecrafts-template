import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CampaignCardIllustration } from "./campaign-card-illustration";

const meta: Meta<typeof CampaignCardIllustration> = {
  title: "UI Illustrations/CampaignCardIllustration",
  component: CampaignCardIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CampaignCardIllustration>;

export const Default: Story = {};
