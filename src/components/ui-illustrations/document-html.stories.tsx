import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DocumentHtmlIllustration } from "./document-html";

const meta: Meta<typeof DocumentHtmlIllustration> = {
  title: "UI Illustrations/Document Html",
  component: DocumentHtmlIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DocumentHtmlIllustration>;
export const Default: Story = {};
