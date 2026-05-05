import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CodeTabs from "./CodeTabs";

const meta: Meta<typeof CodeTabs> = {
  title: "UI Molecules/Code/CodeTabs",
  component: CodeTabs,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CodeTabs>;

export const Default: Story = {};
