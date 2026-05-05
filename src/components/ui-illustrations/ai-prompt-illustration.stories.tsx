import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AiPromptIllustration } from "./ai-prompt-illustration";

const meta: Meta<typeof AiPromptIllustration> = {
  title: "UI Illustrations/AiPromptIllustration",
  component: AiPromptIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AiPromptIllustration>;

export const Default: Story = {};
