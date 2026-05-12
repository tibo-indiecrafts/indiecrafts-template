import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeReviewIllustration } from "./libre-landing-two-code-review-illustration";

const meta: Meta<typeof CodeReviewIllustration> = {
  title: "UI Illustrations/Libre Landing Two Code Review",
  component: CodeReviewIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CodeReviewIllustration>;
export const Default: Story = {};
