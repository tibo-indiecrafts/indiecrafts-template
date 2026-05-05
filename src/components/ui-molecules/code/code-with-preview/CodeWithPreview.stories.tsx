import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LoginPreviewIllustration } from "@/components/ui-illustrations/login-preview-illustration";
import CodeWithPreview from "./CodeWithPreview";

const meta: Meta<typeof CodeWithPreview> = {
  title: "UI Molecules/Code/CodeWithPreview",
  component: CodeWithPreview,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CodeWithPreview>;

export const WithLoginPreview: Story = {
  args: {
    preview: <LoginPreviewIllustration />,
  },
};
