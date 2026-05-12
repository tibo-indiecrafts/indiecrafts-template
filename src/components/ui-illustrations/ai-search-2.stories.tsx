import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AiSearch2Illustration } from "./ai-search-2";

const meta: Meta<typeof AiSearch2Illustration> = {
  title: "UI Illustrations/Ai Search 2",
  component: AiSearch2Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AiSearch2Illustration>;
export const Default: Story = {};
