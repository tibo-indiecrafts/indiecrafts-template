import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable8Section } from "./index";
import { featuresExpandable8Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable8Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable8",
  component: FeaturesExpandable8Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable8Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable8Sample,
    id: "story-features-expandable-8",
  } as React.ComponentProps<typeof FeaturesExpandable8Section>,
};
