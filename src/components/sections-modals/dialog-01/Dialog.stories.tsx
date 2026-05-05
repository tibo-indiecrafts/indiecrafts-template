import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DialogSection from "./Dialog";
import { dialog01Sample } from "./config";

const meta: Meta<typeof DialogSection> = {
  title: "Sections/Modals/Dialog01",
  component: DialogSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof DialogSection>;

export const Default: Story = {
  args: { ...dialog01Sample, id: "dialog-01-default" },
};
