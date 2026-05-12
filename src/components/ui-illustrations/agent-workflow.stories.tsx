import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AgentWorkflowIllustration } from "./agent-workflow";

const meta: Meta<typeof AgentWorkflowIllustration> = {
  title: "UI Illustrations/Agent Workflow",
  component: AgentWorkflowIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AgentWorkflowIllustration>;
export const Default: Story = {};
