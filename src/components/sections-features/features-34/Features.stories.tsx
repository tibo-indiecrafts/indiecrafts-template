import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features34Section } from "./index";

const meta: Meta<typeof Features34Section> = {
  title: "Sections/Features/Features34",
  component: Features34Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features34Section>;
export const Default: Story = { args: { id: "story-features-34" } };
