import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features31Section } from "./index";

const meta: Meta<typeof Features31Section> = {
  title: "Sections/Features/Features31",
  component: Features31Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features31Section>;
export const Default: Story = { args: { id: "story-features-31" } };
