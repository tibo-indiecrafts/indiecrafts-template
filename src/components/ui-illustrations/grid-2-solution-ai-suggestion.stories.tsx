import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AiSuggestionIllustration } from "./grid-2-solution-ai-suggestion";

const meta: Meta<typeof AiSuggestionIllustration> = {
  title: "UI Illustrations/Grid 2 Solution Ai Suggestion",
  component: AiSuggestionIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AiSuggestionIllustration>;
export const Default: Story = {};
