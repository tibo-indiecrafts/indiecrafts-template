import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesCarousel3Section } from "./index";
import { featuresCarousel3Sample } from "./config";

const meta: Meta<typeof FeaturesCarousel3Section> = {
  title: "Sections/FeaturesCarousel/FeaturesCarousel3",
  component: FeaturesCarousel3Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesCarousel3Section>;

export const Default: Story = {
  args: {
    ...featuresCarousel3Sample,
    id: "story-features-carousel-3",
  } as React.ComponentProps<typeof FeaturesCarousel3Section>,
};
