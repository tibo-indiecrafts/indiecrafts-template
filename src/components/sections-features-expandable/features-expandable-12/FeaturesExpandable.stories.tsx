import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable12Section } from "./index";
import { featuresExpandable12Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable12Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable12",
  component: FeaturesExpandable12Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable12Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable12Sample,
    id: "story-features-expandable-12",
  } as React.ComponentProps<typeof FeaturesExpandable12Section>,
};
