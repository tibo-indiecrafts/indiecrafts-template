import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DialogSection from "./Dialog";
import { dialog09Sample } from "./config";

const meta: Meta<typeof DialogSection> = {
  title: "Sections/Modals/Dialog09",
  component: DialogSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof DialogSection>;

export const Default: Story = {
  args: { ...dialog09Sample, id: "dialog-09-default" },
};
