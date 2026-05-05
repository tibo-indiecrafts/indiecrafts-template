import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Integrations } from "./integrations";

const meta: Meta<typeof Integrations> = {
  title: "UI Illustrations/Integrations",
  component: Integrations,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Integrations>;

export const Default: Story = {};
