import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Testimonials from "./Testimonials";
import { testimonials14Sample } from "./config";

const meta: Meta<typeof Testimonials> = {
  title: "Sections/Testimonials/Testimonials14",
  component: Testimonials,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Testimonials>;

export const Default: Story = {
  args: { ...testimonials14Sample, id: "testimonials-14-storybook" },
};
