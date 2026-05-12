import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FlowIllustration } from "./flow-illustration";

const meta: Meta<typeof FlowIllustration> = {
  title: "UI Illustrations/Flow",
  component: FlowIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof FlowIllustration>;

export const Default: Story = {};
