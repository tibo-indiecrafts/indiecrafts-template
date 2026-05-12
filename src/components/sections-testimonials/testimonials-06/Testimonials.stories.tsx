import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Testimonials06Section } from "./index";

const meta: Meta<typeof Testimonials06Section> = {
  title: "Sections/Testimonials/Testimonials06",
  component: Testimonials06Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Testimonials06Section>;
export const Default: Story = { args: { id: "story-testimonials-06" } };
