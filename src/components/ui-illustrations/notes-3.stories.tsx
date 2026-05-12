import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Notes3Illustration } from "./notes-3";

const meta: Meta<typeof Notes3Illustration> = {
  title: "UI Illustrations/Notes 3",
  component: Notes3Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Notes3Illustration>;
export const Default: Story = {};
