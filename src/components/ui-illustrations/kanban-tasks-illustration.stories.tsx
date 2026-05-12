import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KanbanTasksIllustration } from "./kanban-tasks-illustration";

const meta: Meta<typeof KanbanTasksIllustration> = {
  title: "UI Illustrations/KanbanTasks",
  component: KanbanTasksIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof KanbanTasksIllustration>;

export const Default: Story = {};
