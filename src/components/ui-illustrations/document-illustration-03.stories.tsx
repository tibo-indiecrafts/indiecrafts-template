import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DocumentIllustation } from "./document-illustration-03";

const meta: Meta<typeof DocumentIllustation> = {
  title: "UI Illustrations/Grid 1 Landing Document",
  component: DocumentIllustation,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DocumentIllustation>;
export const Default: Story = {};
