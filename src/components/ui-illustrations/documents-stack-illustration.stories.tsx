import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DocumentsStackIllustration } from "./documents-stack-illustration";

const meta: Meta<typeof DocumentsStackIllustration> = {
  title: "UI Illustrations/DocumentsStackIllustration",
  component: DocumentsStackIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DocumentsStackIllustration>;

export const Default: Story = {};
