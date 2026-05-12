import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Testimonials02Section } from "./index";
import { testimonials02Sample } from "./config";

const meta: Meta<typeof Testimonials02Section> = {
  title: "Sections/Testimonials/Testimonials02",
  component: Testimonials02Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Testimonials02Section>;

export const Default: Story = {
  args: { ...testimonials02Sample, id: "story-testimonials-02" } as React.ComponentProps<
    typeof Testimonials02Section
  >,
};
