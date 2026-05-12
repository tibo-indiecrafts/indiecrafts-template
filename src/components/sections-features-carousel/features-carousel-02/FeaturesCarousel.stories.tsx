import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesCarousel02Section } from "./index";
import { featuresCarousel02Sample } from "./config";

const meta: Meta<typeof FeaturesCarousel02Section> = {
  title: "Sections/FeaturesCarousel/FeaturesCarousel02",
  component: FeaturesCarousel02Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesCarousel02Section>;

export const Default: Story = {
  args: {
    ...featuresCarousel02Sample,
    id: "story-features-carousel-02",
  } as React.ComponentProps<typeof FeaturesCarousel02Section>,
};
