import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AgentTaskPlanningIllustration } from "./agent-task-planning-illustration";

const meta: Meta<typeof AgentTaskPlanningIllustration> = {
  title: "UI Illustrations/AgentTaskPlanningIllustration",
  component: AgentTaskPlanningIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AgentTaskPlanningIllustration>;

export const Default: Story = {};
