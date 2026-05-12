import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features29Section } from "./index";

const meta: Meta<typeof Features29Section> = {
  title: "Sections/Features/Features29",
  component: Features29Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features29Section>;

export const Default: Story = { args: { id: "story-features-29" } };
