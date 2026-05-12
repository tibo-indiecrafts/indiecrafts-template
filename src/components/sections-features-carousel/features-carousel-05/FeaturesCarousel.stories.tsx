import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesCarousel05Section } from "./index";
import { featuresCarousel05Sample } from "./config";

const meta: Meta<typeof FeaturesCarousel05Section> = {
  title: "Sections/FeaturesCarousel/FeaturesCarousel05",
  component: FeaturesCarousel05Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesCarousel05Section>;

export const Default: Story = {
  args: {
    ...featuresCarousel05Sample,
    id: "story-features-carousel-05",
  } as React.ComponentProps<typeof FeaturesCarousel05Section>,
};
