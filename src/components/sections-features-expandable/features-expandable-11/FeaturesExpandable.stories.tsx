import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable11Section } from "./index";
import { featuresExpandable11Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable11Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable11",
  component: FeaturesExpandable11Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable11Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable11Sample,
    id: "story-features-expandable-11",
  } as React.ComponentProps<typeof FeaturesExpandable11Section>,
};
