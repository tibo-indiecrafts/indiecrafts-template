import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MobileAiSuggestionIllustration } from "./mobile-ai-suggestion";

const meta: Meta<typeof MobileAiSuggestionIllustration> = {
  title: "UI Illustrations/Mobile Ai Suggestion",
  component: MobileAiSuggestionIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MobileAiSuggestionIllustration>;
export const Default: Story = {};
