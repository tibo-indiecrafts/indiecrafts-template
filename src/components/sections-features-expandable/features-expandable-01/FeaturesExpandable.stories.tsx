import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable01Section } from "./index";
import { featuresExpandable01Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable01Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable01",
  component: FeaturesExpandable01Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable01Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable01Sample,
    id: "story-features-expandable-01",
  } as React.ComponentProps<typeof FeaturesExpandable01Section>,
};
