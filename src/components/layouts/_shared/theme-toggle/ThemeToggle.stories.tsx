import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThemeToggle } from "./index";

const meta: Meta<typeof ThemeToggle> = {
  title: "Layouts/Shared/ThemeToggle",
  component: ThemeToggle,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {};
