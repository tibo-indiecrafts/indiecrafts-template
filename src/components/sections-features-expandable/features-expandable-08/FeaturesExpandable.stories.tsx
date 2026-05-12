import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable08Section } from "./index";
import { featuresExpandable08Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable08Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable08",
  component: FeaturesExpandable08Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable08Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable08Sample,
    id: "story-features-expandable-08",
  } as React.ComponentProps<typeof FeaturesExpandable08Section>,
};
