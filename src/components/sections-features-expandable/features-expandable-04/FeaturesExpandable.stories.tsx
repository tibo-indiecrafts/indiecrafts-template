import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable04Section } from "./index";
import { featuresExpandable04Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable04Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable04",
  component: FeaturesExpandable04Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable04Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable04Sample,
    id: "story-features-expandable-04",
  } as React.ComponentProps<typeof FeaturesExpandable04Section>,
};
