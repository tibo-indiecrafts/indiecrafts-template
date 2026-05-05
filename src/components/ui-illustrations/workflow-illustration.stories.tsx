import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WorkflowIllustration } from "./workflow-illustration";

const meta: Meta<typeof WorkflowIllustration> = {
  title: "UI Illustrations/WorkflowIllustration",
  component: WorkflowIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof WorkflowIllustration>;

export const Default: Story = {};
