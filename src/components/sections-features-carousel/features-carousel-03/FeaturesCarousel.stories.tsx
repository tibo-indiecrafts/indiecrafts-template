import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesCarousel03Section } from "./index";
import { featuresCarousel03Sample } from "./config";

const meta: Meta<typeof FeaturesCarousel03Section> = {
  title: "Sections/FeaturesCarousel/FeaturesCarousel03",
  component: FeaturesCarousel03Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesCarousel03Section>;

export const Default: Story = {
  args: {
    ...featuresCarousel03Sample,
    id: "story-features-carousel-03",
  } as React.ComponentProps<typeof FeaturesCarousel03Section>,
};
