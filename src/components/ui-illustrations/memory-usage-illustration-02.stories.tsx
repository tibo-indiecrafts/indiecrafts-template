import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MemoryUsageIllustration } from "./memory-usage-illustration-02";

const meta: Meta<typeof MemoryUsageIllustration> = {
  title: "UI Illustrations/Libre Landing Memory Usage",
  component: MemoryUsageIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MemoryUsageIllustration>;
export const Default: Story = {};
