import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DialogSection from "./Dialog";
import { dialog07Sample } from "./config";

const meta: Meta<typeof DialogSection> = {
  title: "Sections/Modals/Dialog07",
  component: DialogSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof DialogSection>;

export const Default: Story = {
  args: { ...dialog07Sample, id: "dialog-07-default" },
};
