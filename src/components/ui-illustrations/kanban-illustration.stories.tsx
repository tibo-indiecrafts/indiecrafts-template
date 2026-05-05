import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KanbanIllustration } from "./kanban-illustration";

const meta: Meta<typeof KanbanIllustration> = {
  title: "UI Illustrations/KanbanIllustration",
  component: KanbanIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof KanbanIllustration>;

export const Default: Story = {};
