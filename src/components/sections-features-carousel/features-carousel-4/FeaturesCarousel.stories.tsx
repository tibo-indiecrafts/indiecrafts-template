import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesCarousel4Section } from "./index";
import { featuresCarousel4Sample } from "./config";

const meta: Meta<typeof FeaturesCarousel4Section> = {
  title: "Sections/FeaturesCarousel/FeaturesCarousel4",
  component: FeaturesCarousel4Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesCarousel4Section>;

export const Default: Story = {
  args: {
    ...featuresCarousel4Sample,
    id: "story-features-carousel-4",
  } as React.ComponentProps<typeof FeaturesCarousel4Section>,
};
