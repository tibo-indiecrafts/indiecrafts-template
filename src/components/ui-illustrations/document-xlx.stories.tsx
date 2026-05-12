import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DocumentXlxIllustration } from "./document-xlx";

const meta: Meta<typeof DocumentXlxIllustration> = {
  title: "UI Illustrations/Document Xlx",
  component: DocumentXlxIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DocumentXlxIllustration>;
export const Default: Story = {};
