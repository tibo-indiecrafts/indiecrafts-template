import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Testimonials1Section } from "./index";
import { testimonials1Sample } from "./config";

const meta: Meta<typeof Testimonials1Section> = {
  title: "Sections/Marketing/Testimonials/Testimonials1",
  component: Testimonials1Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Testimonials1Section>;

export const Default: Story = {
  args: { ...testimonials1Sample, id: "story-testimonials-1" } as React.ComponentProps<
    typeof Testimonials1Section
  >,
};
