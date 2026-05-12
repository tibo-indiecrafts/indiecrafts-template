import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable05Section } from "./index";
import { featuresExpandable05Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable05Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable05",
  component: FeaturesExpandable05Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable05Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable05Sample,
    id: "story-features-expandable-05",
  } as React.ComponentProps<typeof FeaturesExpandable05Section>,
};
