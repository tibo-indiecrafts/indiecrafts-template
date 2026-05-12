import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features32Section } from "./index";

const meta: Meta<typeof Features32Section> = {
  title: "Sections/Features/Features32",
  component: Features32Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features32Section>;
export const Default: Story = { args: { id: "story-features-32" } };
