import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Testimonials05Section } from "./index";

const meta: Meta<typeof Testimonials05Section> = {
  title: "Sections/Testimonials/Testimonials05",
  component: Testimonials05Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Testimonials05Section>;
export const Default: Story = { args: { id: "story-testimonials-05" } };
