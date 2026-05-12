import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features38Section } from "./index";

const meta: Meta<typeof Features38Section> = {
  title: "Sections/Features/Features38",
  component: Features38Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features38Section>;
export const Default: Story = { args: { id: "story-features-38" } };
