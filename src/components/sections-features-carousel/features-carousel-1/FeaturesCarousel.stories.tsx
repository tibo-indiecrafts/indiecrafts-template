import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesCarousel1Section } from "./index";
import { featuresCarousel1Sample } from "./config";

const meta: Meta<typeof FeaturesCarousel1Section> = {
  title: "Sections/FeaturesCarousel/FeaturesCarousel1",
  component: FeaturesCarousel1Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesCarousel1Section>;

export const Default: Story = {
  args: {
    ...featuresCarousel1Sample,
    id: "story-features-carousel-1",
  } as React.ComponentProps<typeof FeaturesCarousel1Section>,
};
