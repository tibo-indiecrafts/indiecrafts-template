import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AiOverviewIllustration } from "./ai-overview-illustration";

const meta: Meta<typeof AiOverviewIllustration> = {
  title: "UI Illustrations/Libre Landing Two Ai Overview",
  component: AiOverviewIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AiOverviewIllustration>;
export const Default: Story = {};
