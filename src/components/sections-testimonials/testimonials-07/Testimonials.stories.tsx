import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Testimonials07Section } from "./index";

const meta: Meta<typeof Testimonials07Section> = {
  title: "Sections/Testimonials/Testimonials07",
  component: Testimonials07Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Testimonials07Section>;
export const Default: Story = { args: { id: "story-testimonials-07" } };
