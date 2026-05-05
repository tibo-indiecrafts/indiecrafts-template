import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable17Section } from "./index";
import { featuresExpandable17Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable17Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable17",
  component: FeaturesExpandable17Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable17Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable17Sample,
    id: "story-features-expandable-17",
  } as React.ComponentProps<typeof FeaturesExpandable17Section>,
};
