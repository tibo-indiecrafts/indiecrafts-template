import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AgentTasksIllustration } from "./agent-tasks";

const meta: Meta<typeof AgentTasksIllustration> = {
  title: "UI Illustrations/Agent Tasks",
  component: AgentTasksIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AgentTasksIllustration>;
export const Default: Story = {};
