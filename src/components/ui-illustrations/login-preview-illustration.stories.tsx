import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LoginPreviewIllustration } from "./login-preview-illustration";

const meta: Meta<typeof LoginPreviewIllustration> = {
  title: "UI Illustrations/LoginPreview",
  component: LoginPreviewIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof LoginPreviewIllustration>;

export const Default: Story = {};
