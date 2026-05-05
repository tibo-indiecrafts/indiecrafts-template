import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CommandMenuSection from "./CommandMenu02";
import { commandMenu02Sample } from "./config";

const meta: Meta<typeof CommandMenuSection> = {
  title: "UI Molecules/CommandMenu/CommandMenu02",
  component: CommandMenuSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof CommandMenuSection>;

export const Default: Story = {
  args: { ...commandMenu02Sample, id: "command-menu-02-default" },
};
