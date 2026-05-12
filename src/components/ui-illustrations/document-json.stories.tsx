import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DocumentJsonIllustration } from "./document-json";

const meta: Meta<typeof DocumentJsonIllustration> = {
  title: "UI Illustrations/Document Json",
  component: DocumentJsonIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DocumentJsonIllustration>;
export const Default: Story = {};
