import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DialogSection from "./Dialog";
import { dialog11Sample } from "./config";

const meta: Meta<typeof DialogSection> = {
  title: "Sections/Modals/Dialog11",
  component: DialogSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof DialogSection>;

export const Default: Story = {
  args: { ...dialog11Sample, id: "dialog-11-default" },
};
