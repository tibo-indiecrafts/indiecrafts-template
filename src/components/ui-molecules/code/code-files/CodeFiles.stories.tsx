import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CodeFiles from "./CodeFiles";

const meta: Meta<typeof CodeFiles> = {
  title: "UI Molecules/Code/CodeFiles",
  component: CodeFiles,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CodeFiles>;

export const Default: Story = {};
