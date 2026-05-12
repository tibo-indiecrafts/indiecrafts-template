import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MobileNoteIllustration } from "./mobile-note";

const meta: Meta<typeof MobileNoteIllustration> = {
  title: "UI Illustrations/Mobile Note",
  component: MobileNoteIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MobileNoteIllustration>;
export const Default: Story = {};
