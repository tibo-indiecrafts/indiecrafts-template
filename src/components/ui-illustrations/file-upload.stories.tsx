import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FileUploadIllustration } from "./file-upload";

const meta: Meta<typeof FileUploadIllustration> = {
  title: "UI Illustrations/File Upload",
  component: FileUploadIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof FileUploadIllustration>;
export const Default: Story = {};
