import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Testimonials from "./Testimonials";
import { testimonials13Sample } from "./config";

const meta: Meta<typeof Testimonials> = {
  title: "Sections/Testimonials/Testimonials13",
  component: Testimonials,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Testimonials>;

export const Default: Story = {
  args: { ...testimonials13Sample, id: "testimonials-13-storybook" },
};
