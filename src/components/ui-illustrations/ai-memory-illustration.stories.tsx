import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AiMemoryIllustration } from "./ai-memory-illustration";

const meta: Meta<typeof AiMemoryIllustration> = {
  title: "UI Illustrations/AiMemory",
  component: AiMemoryIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AiMemoryIllustration>;

export const Default: Story = {};
