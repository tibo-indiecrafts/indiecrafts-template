import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CommandMenuSection from "./CommandMenu03";
import { commandMenu03Sample } from "./config";

const meta: Meta<typeof CommandMenuSection> = {
  title: "UI Molecules/CommandMenu/CommandMenu03",
  component: CommandMenuSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CommandMenuSection>;

export const Default: Story = {
  args: { ...commandMenu03Sample, id: "command-menu-03-default" },
};
