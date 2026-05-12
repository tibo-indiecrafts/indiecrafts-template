import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable09Section } from "./index";
import { featuresExpandable09Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable09Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable09",
  component: FeaturesExpandable09Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable09Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable09Sample,
    id: "story-features-expandable-09",
  } as React.ComponentProps<typeof FeaturesExpandable09Section>,
};
