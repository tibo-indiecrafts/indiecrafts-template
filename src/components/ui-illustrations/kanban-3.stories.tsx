import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Kanban3Illustration } from "./kanban-3";

const meta: Meta<typeof Kanban3Illustration> = {
  title: "UI Illustrations/Kanban 3",
  component: Kanban3Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Kanban3Illustration>;
export const Default: Story = {};
