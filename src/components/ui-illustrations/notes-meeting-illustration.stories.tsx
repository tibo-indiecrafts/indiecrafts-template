import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NotesMeetingIllustration } from "./notes-meeting-illustration";

const meta: Meta<typeof NotesMeetingIllustration> = {
  title: "UI Illustrations/NotesMeetingIllustration",
  component: NotesMeetingIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof NotesMeetingIllustration>;

export const Default: Story = {};
