import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesCarousel5Section } from "./index";
import { featuresCarousel5Sample } from "./config";

const meta: Meta<typeof FeaturesCarousel5Section> = {
  title: "Sections/FeaturesCarousel/FeaturesCarousel5",
  component: FeaturesCarousel5Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesCarousel5Section>;

export const Default: Story = {
  args: {
    ...featuresCarousel5Sample,
    id: "story-features-carousel-5",
  } as React.ComponentProps<typeof FeaturesCarousel5Section>,
};
