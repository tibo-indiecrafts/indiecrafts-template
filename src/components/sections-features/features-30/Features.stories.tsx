import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features30Section } from "./index";

const meta: Meta<typeof Features30Section> = {
  title: "Sections/Features/Features30",
  component: Features30Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features30Section>;

export const Default: Story = { args: { id: "story-features-30" } };
