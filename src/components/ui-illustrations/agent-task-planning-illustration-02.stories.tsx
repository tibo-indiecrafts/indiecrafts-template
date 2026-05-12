import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AgentTaskPlanningIllustration } from "./agent-task-planning-illustration-02";

const meta: Meta<typeof AgentTaskPlanningIllustration> = {
  title: "UI Illustrations/Grid 2 Product Agent Task Planning",
  component: AgentTaskPlanningIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AgentTaskPlanningIllustration>;
export const Default: Story = {};
