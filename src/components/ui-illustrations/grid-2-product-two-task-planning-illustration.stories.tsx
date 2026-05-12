import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TaskPlanningIllustration } from "./grid-2-product-two-task-planning-illustration";

const meta: Meta<typeof TaskPlanningIllustration> = {
  title: "UI Illustrations/Grid 2 Product Two Task Planning",
  component: TaskPlanningIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof TaskPlanningIllustration>;
export const Default: Story = {};
