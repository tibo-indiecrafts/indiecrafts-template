import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features37Section } from "./index";

const meta: Meta<typeof Features37Section> = {
  title: "Sections/Features/Features37",
  component: Features37Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features37Section>;
export const Default: Story = { args: { id: "story-features-37" } };
