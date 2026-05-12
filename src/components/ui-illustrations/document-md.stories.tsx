import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DocumentMdIllustration } from "./document-md";

const meta: Meta<typeof DocumentMdIllustration> = {
  title: "UI Illustrations/Document Md",
  component: DocumentMdIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DocumentMdIllustration>;
export const Default: Story = {};
