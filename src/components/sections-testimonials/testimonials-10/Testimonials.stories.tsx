import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Testimonials from "./Testimonials";
import { testimonials10Sample } from "./config";

const meta: Meta<typeof Testimonials> = {
  title: "Sections/Testimonials/Testimonials10",
  component: Testimonials,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Testimonials>;

export const Default: Story = {
  args: { ...testimonials10Sample, id: "testimonials-10-storybook" },
};
