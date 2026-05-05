import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable19Section } from "./index";
import { featuresExpandable19Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable19Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable19",
  component: FeaturesExpandable19Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable19Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable19Sample,
    id: "story-features-expandable-19",
  } as React.ComponentProps<typeof FeaturesExpandable19Section>,
};
