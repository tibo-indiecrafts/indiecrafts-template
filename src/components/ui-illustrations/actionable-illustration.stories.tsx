import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ActionableIllustration } from "./actionable-illustration";

const meta: Meta<typeof ActionableIllustration> = {
  title: "UI Illustrations/ActionableIllustration",
  component: ActionableIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ActionableIllustration>;

export const Default: Story = {};
