import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MemoryUsageIllustration } from "./libre-landing-memory-usage-illustration";

const meta: Meta<typeof MemoryUsageIllustration> = {
  title: "UI Illustrations/Libre Landing Memory Usage",
  component: MemoryUsageIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MemoryUsageIllustration>;
export const Default: Story = {};
