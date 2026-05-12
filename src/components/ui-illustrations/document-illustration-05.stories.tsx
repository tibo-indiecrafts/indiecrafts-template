import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DocumentIllustation } from "./document-illustration-05";

const meta: Meta<typeof DocumentIllustation> = {
  title: "UI Illustrations/Libre Landing Two Document",
  component: DocumentIllustation,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DocumentIllustation>;
export const Default: Story = {};
