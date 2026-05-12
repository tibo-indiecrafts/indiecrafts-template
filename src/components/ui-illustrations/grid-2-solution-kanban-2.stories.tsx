import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Kanban2Illustration } from "./grid-2-solution-kanban-2";

const meta: Meta<typeof Kanban2Illustration> = {
  title: "UI Illustrations/Grid 2 Solution Kanban 2",
  component: Kanban2Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Kanban2Illustration>;
export const Default: Story = {};
