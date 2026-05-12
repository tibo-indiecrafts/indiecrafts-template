import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DocumentImgIllustration } from "./document-img";

const meta: Meta<typeof DocumentImgIllustration> = {
  title: "UI Illustrations/Document Img",
  component: DocumentImgIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DocumentImgIllustration>;
export const Default: Story = {};
