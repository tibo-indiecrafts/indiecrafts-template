import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features35Section } from "./index";

const meta: Meta<typeof Features35Section> = {
  title: "Sections/Features/Features35",
  component: Features35Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features35Section>;
export const Default: Story = { args: { id: "story-features-35" } };
