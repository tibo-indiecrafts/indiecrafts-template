import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features33Section } from "./index";

const meta: Meta<typeof Features33Section> = {
  title: "Sections/Features/Features33",
  component: Features33Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features33Section>;
export const Default: Story = { args: { id: "story-features-33" } };
