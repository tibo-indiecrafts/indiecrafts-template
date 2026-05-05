import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable6Section } from "./index";
import { featuresExpandable6Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable6Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable6",
  component: FeaturesExpandable6Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable6Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable6Sample,
    id: "story-features-expandable-6",
  } as React.ComponentProps<typeof FeaturesExpandable6Section>,
};
