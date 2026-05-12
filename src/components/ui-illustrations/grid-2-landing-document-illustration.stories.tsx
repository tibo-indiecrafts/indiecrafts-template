import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DocumentIllustation } from "./grid-2-landing-document-illustration";

const meta: Meta<typeof DocumentIllustation> = {
  title: "UI Illustrations/Grid 2 Landing Document",
  component: DocumentIllustation,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DocumentIllustation>;
export const Default: Story = {};
