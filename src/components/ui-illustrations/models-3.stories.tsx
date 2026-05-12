import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Models3Illustration } from "./models-3";

const meta: Meta<typeof Models3Illustration> = {
  title: "UI Illustrations/Models 3",
  component: Models3Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Models3Illustration>;
export const Default: Story = {};
