import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Testimonials from "./Testimonials";
import { testimonials12Sample } from "./config";

const meta: Meta<typeof Testimonials> = {
  title: "Sections/Testimonials/Testimonials12",
  component: Testimonials,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Testimonials>;

export const Default: Story = {
  args: { ...testimonials12Sample, id: "testimonials-12-storybook" },
};
