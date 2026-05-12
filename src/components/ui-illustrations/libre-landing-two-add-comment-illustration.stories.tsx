import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AddCommentIllustration } from "./libre-landing-two-add-comment-illustration";

const meta: Meta<typeof AddCommentIllustration> = {
  title: "UI Illustrations/Libre Landing Two Add Comment",
  component: AddCommentIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AddCommentIllustration>;
export const Default: Story = {};
