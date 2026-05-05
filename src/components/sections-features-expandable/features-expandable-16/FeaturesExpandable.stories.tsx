import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable16Section } from "./index";
import { featuresExpandable16Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable16Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable16",
  component: FeaturesExpandable16Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable16Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable16Sample,
    id: "story-features-expandable-16",
  } as React.ComponentProps<typeof FeaturesExpandable16Section>,
};
