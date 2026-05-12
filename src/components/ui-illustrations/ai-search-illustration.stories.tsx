import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AiSearchIllustration } from "./ai-search-illustration";

const meta: Meta<typeof AiSearchIllustration> = {
  title: "UI Illustrations/AiSearch",
  component: AiSearchIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AiSearchIllustration>;

export const Default: Story = {};
