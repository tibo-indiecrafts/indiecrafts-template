import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Testimonials03Section } from "./index";

const meta: Meta<typeof Testimonials03Section> = {
  title: "Sections/Testimonials/Testimonials03",
  component: Testimonials03Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Testimonials03Section>;

export const Default: Story = { args: { id: "story-testimonials-03" } };
