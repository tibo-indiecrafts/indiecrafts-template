import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable20Section } from "./index";
import { featuresExpandable20Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable20Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable20",
  component: FeaturesExpandable20Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable20Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable20Sample,
    id: "story-features-expandable-20",
  } as React.ComponentProps<typeof FeaturesExpandable20Section>,
};
