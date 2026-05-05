import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable4Section } from "./index";
import { featuresExpandable4Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable4Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable4",
  component: FeaturesExpandable4Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable4Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable4Sample,
    id: "story-features-expandable-4",
  } as React.ComponentProps<typeof FeaturesExpandable4Section>,
};
