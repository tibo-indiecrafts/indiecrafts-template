import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable13Section } from "./index";
import { featuresExpandable13Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable13Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable13",
  component: FeaturesExpandable13Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable13Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable13Sample,
    id: "story-features-expandable-13",
  } as React.ComponentProps<typeof FeaturesExpandable13Section>,
};
