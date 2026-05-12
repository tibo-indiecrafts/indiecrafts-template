import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CommentIllustration } from "./comment";

const meta: Meta<typeof CommentIllustration> = {
  title: "UI Illustrations/Comment",
  component: CommentIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CommentIllustration>;
export const Default: Story = {};
