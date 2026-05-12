import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AgentTaskPlanningIllustration } from "./grid-2-product-two-agent-task-planning-illustration";

const meta: Meta<typeof AgentTaskPlanningIllustration> = {
  title: "UI Illustrations/Grid 2 Product Two Agent Task Planning",
  component: AgentTaskPlanningIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AgentTaskPlanningIllustration>;
export const Default: Story = {};
