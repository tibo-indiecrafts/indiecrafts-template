import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable06Section } from "./index";
import { featuresExpandable06Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable06Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable06",
  component: FeaturesExpandable06Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable06Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable06Sample,
    id: "story-features-expandable-06",
  } as React.ComponentProps<typeof FeaturesExpandable06Section>,
};
