import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features36Section } from "./index";

const meta: Meta<typeof Features36Section> = {
  title: "Sections/Features/Features36",
  component: Features36Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features36Section>;
export const Default: Story = { args: { id: "story-features-36" } };
