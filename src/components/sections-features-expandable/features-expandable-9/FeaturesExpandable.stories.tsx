import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable9Section } from "./index";
import { featuresExpandable9Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable9Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable9",
  component: FeaturesExpandable9Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable9Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable9Sample,
    id: "story-features-expandable-9",
  } as React.ComponentProps<typeof FeaturesExpandable9Section>,
};
