import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesCarousel01Section } from "./index";
import { featuresCarousel01Sample } from "./config";

const meta: Meta<typeof FeaturesCarousel01Section> = {
  title: "Sections/FeaturesCarousel/FeaturesCarousel01",
  component: FeaturesCarousel01Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesCarousel01Section>;

export const Default: Story = {
  args: {
    ...featuresCarousel01Sample,
    id: "story-features-carousel-01",
  } as React.ComponentProps<typeof FeaturesCarousel01Section>,
};
