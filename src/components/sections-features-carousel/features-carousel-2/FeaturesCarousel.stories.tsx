import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesCarousel2Section } from "./index";
import { featuresCarousel2Sample } from "./config";

const meta: Meta<typeof FeaturesCarousel2Section> = {
  title: "Sections/FeaturesCarousel/FeaturesCarousel2",
  component: FeaturesCarousel2Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesCarousel2Section>;

export const Default: Story = {
  args: {
    ...featuresCarousel2Sample,
    id: "story-features-carousel-2",
  } as React.ComponentProps<typeof FeaturesCarousel2Section>,
};
