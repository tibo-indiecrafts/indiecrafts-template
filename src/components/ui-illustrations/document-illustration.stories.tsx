import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DocumentIllustration } from "./document-illustration";

const meta: Meta<typeof DocumentIllustration> = {
  title: "UI Illustrations/Document",
  component: DocumentIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DocumentIllustration>;

export const Default: Story = {};
