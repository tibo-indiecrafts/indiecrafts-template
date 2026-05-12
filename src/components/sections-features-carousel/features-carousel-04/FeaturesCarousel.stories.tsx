import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesCarousel04Section } from "./index";
import { featuresCarousel04Sample } from "./config";

const meta: Meta<typeof FeaturesCarousel04Section> = {
  title: "Sections/FeaturesCarousel/FeaturesCarousel04",
  component: FeaturesCarousel04Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesCarousel04Section>;

export const Default: Story = {
  args: {
    ...featuresCarousel04Sample,
    id: "story-features-carousel-04",
  } as React.ComponentProps<typeof FeaturesCarousel04Section>,
};
