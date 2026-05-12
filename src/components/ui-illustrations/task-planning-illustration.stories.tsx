import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TaskPlanningIllustration } from "./task-planning-illustration";

const meta: Meta<typeof TaskPlanningIllustration> = {
  title: "UI Illustrations/Grid 2 Product Task Planning",
  component: TaskPlanningIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof TaskPlanningIllustration>;
export const Default: Story = {};
