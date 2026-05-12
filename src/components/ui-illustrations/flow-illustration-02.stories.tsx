import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FlowIllustration } from "./flow-illustration-02";

const meta: Meta<typeof FlowIllustration> = {
  title: "UI Illustrations/Grid 2 Landing Flow",
  component: FlowIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof FlowIllustration>;
export const Default: Story = {};
