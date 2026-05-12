import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TodoAppIllustration } from "./todo-app";

const meta: Meta<typeof TodoAppIllustration> = {
  title: "UI Illustrations/Todo App",
  component: TodoAppIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof TodoAppIllustration>;
export const Default: Story = {};
