import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ServerIllustration } from "./server-illustration";

const meta: Meta<typeof ServerIllustration> = {
  title: "UI Illustrations/ServerIllustration",
  component: ServerIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ServerIllustration>;

export const Active: Story = { args: { isActive: true } };
export const Inactive: Story = { args: { isActive: false } };
