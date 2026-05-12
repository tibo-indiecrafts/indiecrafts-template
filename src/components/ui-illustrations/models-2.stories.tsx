import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Models2Illustration } from "./models-2";

const meta: Meta<typeof Models2Illustration> = {
  title: "UI Illustrations/Models 2",
  component: Models2Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Models2Illustration>;
export const Default: Story = {};
