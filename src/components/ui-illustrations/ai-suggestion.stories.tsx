import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AiSuggestion2Illustration } from "./ai-suggestion";

const meta: Meta<typeof AiSuggestion2Illustration> = {
  title: "UI Illustrations/Ai Suggestion",
  component: AiSuggestion2Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AiSuggestion2Illustration>;
export const Default: Story = {};
