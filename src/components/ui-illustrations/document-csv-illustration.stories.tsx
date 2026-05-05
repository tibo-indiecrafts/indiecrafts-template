import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DocumentCsvIllustration } from "./document-csv-illustration";

const meta: Meta<typeof DocumentCsvIllustration> = {
  title: "UI Illustrations/DocumentCsvIllustration",
  component: DocumentCsvIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DocumentCsvIllustration>;

export const Default: Story = {};
