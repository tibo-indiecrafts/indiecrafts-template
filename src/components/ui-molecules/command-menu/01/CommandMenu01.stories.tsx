import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CommandMenuSection from "./CommandMenu01";
import { commandMenu01Sample } from "./config";

const meta: Meta<typeof CommandMenuSection> = {
  title: "UI Molecules/CommandMenu/CommandMenu01",
  component: CommandMenuSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CommandMenuSection>;

export const Default: Story = {
  args: { ...commandMenu01Sample, id: "command-menu-01-default" },
};
