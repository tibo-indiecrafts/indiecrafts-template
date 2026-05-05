import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturesExpandable15Section } from "./index";
import { featuresExpandable15Sample } from "./config";

const meta: Meta<typeof FeaturesExpandable15Section> = {
  title: "Sections/FeaturesExpandable/FeaturesExpandable15",
  component: FeaturesExpandable15Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FeaturesExpandable15Section>;

export const Default: Story = {
  args: {
    ...featuresExpandable15Sample,
    id: "story-features-expandable-15",
  } as React.ComponentProps<typeof FeaturesExpandable15Section>,
};
