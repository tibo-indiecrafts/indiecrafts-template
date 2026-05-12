import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DocumentPdfIllustration } from "./document-pdf";

const meta: Meta<typeof DocumentPdfIllustration> = {
  title: "UI Illustrations/Document Pdf",
  component: DocumentPdfIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DocumentPdfIllustration>;
export const Default: Story = {};
