import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable18Section } from "./index";
import { featuresExpandable18Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable18Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable18",
  component: FeaturesExpandable18Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable18Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable18Sample,
    id: "story-features-expandable-18",
  } as React.ComponentProps<typeof FeaturesExpandable18Section>,
};
