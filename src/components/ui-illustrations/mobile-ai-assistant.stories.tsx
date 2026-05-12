import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MobileAiAssistantIllustration } from "./mobile-ai-assistant";

const meta: Meta<typeof MobileAiAssistantIllustration> = {
  title: "UI Illustrations/Mobile Ai Assistant",
  component: MobileAiAssistantIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MobileAiAssistantIllustration>;
export const Default: Story = {};
