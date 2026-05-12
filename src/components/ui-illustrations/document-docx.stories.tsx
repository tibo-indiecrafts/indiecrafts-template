import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DocumentDocxIllustration } from "./document-docx";

const meta: Meta<typeof DocumentDocxIllustration> = {
  title: "UI Illustrations/Document Docx",
  component: DocumentDocxIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DocumentDocxIllustration>;
export const Default: Story = {};
