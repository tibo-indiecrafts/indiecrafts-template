import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AiSummarizationIllustration } from "./ai-summarization";

const meta: Meta<typeof AiSummarizationIllustration> = {
  title: "UI Illustrations/Ai Summarization",
  component: AiSummarizationIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AiSummarizationIllustration>;
export const Default: Story = {};
