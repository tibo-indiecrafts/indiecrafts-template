import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Testimonials from "./Testimonials";
import { testimonials11Sample } from "./config";

const meta: Meta<typeof Testimonials> = {
  title: "Sections/Testimonials/Testimonials11",
  component: Testimonials,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Testimonials>;

export const Default: Story = {
  args: { ...testimonials11Sample, id: "testimonials-11-storybook" },
};
