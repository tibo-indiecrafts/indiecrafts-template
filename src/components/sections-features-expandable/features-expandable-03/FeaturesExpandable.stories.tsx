import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable03Section } from "./index";
import { featuresExpandable03Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable03Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable03",
  component: FeaturesExpandable03Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable03Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable03Sample,
    id: "story-features-expandable-03",
  } as React.ComponentProps<typeof FeaturesExpandable03Section>,
};
