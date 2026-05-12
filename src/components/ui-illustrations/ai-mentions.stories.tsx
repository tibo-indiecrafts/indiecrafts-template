import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AiMentionsIllustration } from "./ai-mentions";

const meta: Meta<typeof AiMentionsIllustration> = {
  title: "UI Illustrations/Ai Mentions",
  component: AiMentionsIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AiMentionsIllustration>;
export const Default: Story = {};
