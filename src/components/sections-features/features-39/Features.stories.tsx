import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Features39Section } from "./index";

const meta: Meta<typeof Features39Section> = {
  title: "Sections/Features/Features39",
  component: Features39Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features39Section>;
export const Default: Story = { args: { id: "story-features-39" } };
