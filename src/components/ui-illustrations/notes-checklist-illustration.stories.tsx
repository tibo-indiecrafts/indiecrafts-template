import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NotesChecklistIllustration } from "./notes-checklist-illustration";

const meta: Meta<typeof NotesChecklistIllustration> = {
  title: "UI Illustrations/NotesChecklist",
  component: NotesChecklistIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof NotesChecklistIllustration>;

export const Default: Story = {};
