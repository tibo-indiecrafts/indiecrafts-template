import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DocumentZipIllustration } from "./document-zip";

const meta: Meta<typeof DocumentZipIllustration> = {
  title: "UI Illustrations/Document Zip",
  component: DocumentZipIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DocumentZipIllustration>;
export const Default: Story = {};
