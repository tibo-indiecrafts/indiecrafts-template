import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NotesIllustration } from "./notes-illustration";

const meta: Meta<typeof NotesIllustration> = {
  title: "UI Illustrations/Notes",
  component: NotesIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof NotesIllustration>;

export const Default: Story = {};
