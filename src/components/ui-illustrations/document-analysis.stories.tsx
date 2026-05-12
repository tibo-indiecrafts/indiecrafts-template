import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DocumentAnalysisIllustration } from "./document-analysis";

const meta: Meta<typeof DocumentAnalysisIllustration> = {
  title: "UI Illustrations/Document Analysis",
  component: DocumentAnalysisIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DocumentAnalysisIllustration>;
export const Default: Story = {};
