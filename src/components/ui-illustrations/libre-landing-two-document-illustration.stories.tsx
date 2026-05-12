import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DocumentIllustation } from "./libre-landing-two-document-illustration";

const meta: Meta<typeof DocumentIllustation> = {
  title: "UI Illustrations/Libre Landing Two Document",
  component: DocumentIllustation,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DocumentIllustation>;
export const Default: Story = {};
