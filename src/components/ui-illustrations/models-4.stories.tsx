import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Models4Illustration } from "./models-4";

const meta: Meta<typeof Models4Illustration> = {
  title: "UI Illustrations/Models 4",
  component: Models4Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Models4Illustration>;
export const Default: Story = {};
