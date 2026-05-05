import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable21Section } from "./index";
import { featuresExpandable21Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable21Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable21",
  component: FeaturesExpandable21Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable21Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable21Sample,
    id: "story-features-expandable-21",
  } as React.ComponentProps<typeof FeaturesExpandable21Section>,
};
