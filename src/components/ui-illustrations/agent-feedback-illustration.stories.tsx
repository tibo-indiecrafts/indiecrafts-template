import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AgentFeedbackIllustration } from "./agent-feedback-illustration";

const meta: Meta<typeof AgentFeedbackIllustration> = {
  title: "UI Illustrations/AgentFeedbackIllustration",
  component: AgentFeedbackIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AgentFeedbackIllustration>;

export const Default: Story = {};
