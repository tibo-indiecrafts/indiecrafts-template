import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Testimonials04Section } from "./index";

const meta: Meta<typeof Testimonials04Section> = {
  title: "Sections/Testimonials/Testimonials04",
  component: Testimonials04Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Testimonials04Section>;
export const Default: Story = { args: { id: "story-testimonials-04" } };
