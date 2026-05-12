import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DocumentTxtIllustration } from "./document-txt";

const meta: Meta<typeof DocumentTxtIllustration> = {
  title: "UI Illustrations/Document Txt",
  component: DocumentTxtIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DocumentTxtIllustration>;
export const Default: Story = {};
