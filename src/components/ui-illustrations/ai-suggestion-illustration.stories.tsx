import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AiSuggestionIllustration } from "./ai-suggestion-illustration";

const meta: Meta<typeof AiSuggestionIllustration> = {
  title: "UI Illustrations/Grid 1 Landing Ai Suggestion",
  component: AiSuggestionIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AiSuggestionIllustration>;
export const Default: Story = {};
