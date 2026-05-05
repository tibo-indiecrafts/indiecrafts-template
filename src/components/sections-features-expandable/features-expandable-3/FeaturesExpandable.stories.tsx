import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable3Section } from "./index";
import { featuresExpandable3Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable3Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable3",
  component: FeaturesExpandable3Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable3Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable3Sample,
    id: "story-features-expandable-3",
  } as React.ComponentProps<typeof FeaturesExpandable3Section>,
};
