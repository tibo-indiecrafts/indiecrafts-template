import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DocumentPptxIllustration } from "./document-pptx";

const meta: Meta<typeof DocumentPptxIllustration> = {
  title: "UI Illustrations/Document Pptx",
  component: DocumentPptxIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DocumentPptxIllustration>;
export const Default: Story = {};
