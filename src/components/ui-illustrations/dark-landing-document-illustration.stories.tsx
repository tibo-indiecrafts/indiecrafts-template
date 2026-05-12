import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DocumentIllustation } from "./dark-landing-document-illustration";

const meta: Meta<typeof DocumentIllustation> = {
  title: "UI Illustrations/Dark Landing Document",
  component: DocumentIllustation,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DocumentIllustation>;
export const Default: Story = {};
