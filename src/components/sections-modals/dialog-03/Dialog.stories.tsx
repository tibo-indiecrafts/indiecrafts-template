import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DialogSection from "./Dialog";
import { dialog03Sample } from "./config";

const meta: Meta<typeof DialogSection> = {
  title: "Sections/Modals/Dialog03",
  component: DialogSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof DialogSection>;

export const Default: Story = {
  args: { ...dialog03Sample, id: "dialog-03-default" },
};
