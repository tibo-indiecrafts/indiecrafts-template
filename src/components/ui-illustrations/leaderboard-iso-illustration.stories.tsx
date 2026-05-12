import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LeaderboardIsoIllustration } from "./leaderboard-iso-illustration";

const meta: Meta<typeof LeaderboardIsoIllustration> = {
  title: "UI Illustrations/LeaderboardIso",
  component: LeaderboardIsoIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof LeaderboardIsoIllustration>;

export const Default: Story = {};
